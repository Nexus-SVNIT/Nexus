// backup.js
const mongoose = require("mongoose");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;
const DRIVE_BACKUP_FOLDER_ID = process.env.DRIVE_BACKUP_FOLDER_ID;
const SERVICE_ACCOUNT_PATH = process.env.SERVICE_ACCOUNT_PATH || "./service-account.json";
const BACKUP_PREFIX = "backup-"; // used for cleanup filtering
const MAX_BACKUPS = 7;

async function backupMongoToDrive() {
    console.log(MONGO_URL, DRIVE_BACKUP_FOLDER_ID, SERVICE_ACCOUNT_PATH);
  if (!MONGO_URL || !DRIVE_BACKUP_FOLDER_ID) {
    console.error("❌ Missing required environment variables MONGO_URL or DRIVE_BACKUP_FOLDER_ID");
    process.exit(1);
  }

  console.log("📦 Connecting to MongoDB with Mongoose...");
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();

  let backupData = {};

  console.log("📄 Fetching collections...");
  for (let col of collections) {
    const collection = db.collection(col.name);
    const docs = await collection.find({}).toArray();
    backupData[col.name] = docs;
    console.log(`✅ Fetched ${docs.length} documents from ${col.name}`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${BACKUP_PREFIX}${timestamp}.json`;
  const filePath = path.join(__dirname, fileName);

  fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));
  console.log(`💾 Backup saved locally as ${fileName}`);

  console.log("☁️ Uploading to Google Drive...");
    const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const drive = google.drive({ version: "v3", auth });

  const fileMetadata = {
    name: fileName,
    parents: [DRIVE_BACKUP_FOLDER_ID],
  };
  const media = {
    mimeType: "application/json",
    body: fs.createReadStream(filePath),
  };

  const uploadedFile = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id, name, createdTime",
  });

  console.log(`✅ Uploaded: ${uploadedFile.data.name} (ID: ${uploadedFile.data.id})`);

  await cleanupOldBackups(drive);

  await mongoose.disconnect();
}

async function cleanupOldBackups(drive) {
  console.log("🧹 Checking for old backups...");

  const res = await drive.files.list({
    q: `'${DRIVE_BACKUP_FOLDER_ID}' in parents and name contains '${BACKUP_PREFIX}'`,
    fields: "files(id, name, createdTime)",
    orderBy: "createdTime desc",
  });

  const files = res.data.files;
  if (!files || files.length <= MAX_BACKUPS) {
    console.log("✅ No old backups to delete.");
    return;
  }

  const oldFiles = files.slice(MAX_BACKUPS);
  for (let file of oldFiles) {
    await drive.files.delete({ fileId: file.id });
    console.log(`🗑️ Deleted old backup: ${file.name}`);
  }
}

backupMongoToDrive().catch(err => {
  console.error("❌ Error during backup:", err);
  process.exit(1);
});