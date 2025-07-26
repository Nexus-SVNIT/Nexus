// This script is intended to be run by GitHub Actions to mark users as alumni for a given year.
// Usage: node scripts/markAlumniGithubAction.js [year]

const mongoose = require('mongoose');
const User = require('../server/models/userModel');

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
    console.error('Error: MONGO_URL environment variable is not set. Please set it before running this script.');
    process.exit(1);
}

function getPassingYear(admissionNo) {
    if (!admissionNo || admissionNo.length < 3) return null;
    const type = admissionNo[0].toUpperCase();
    const yearStr = admissionNo.slice(1, 3);
    const startYear = parseInt('20' + yearStr, 10);
    if (isNaN(startYear)) return null;
    let duration;
    if (type === 'U') duration = 4;
    else if (type === 'P') duration = 2;
    else if (type === 'I' || type === 'D') duration = 5;
    else return null;
    return startYear + duration;
}

async function main() {
    const year = process.argv[2] ? parseInt(process.argv[2], 10) : new Date().getFullYear();
    await mongoose.connect(MONGO_URL);
    const users = await User.find({ isAlumni: { $ne: true } });
    let updated = 0;
    for (const user of users) {
        const passingYear = getPassingYear(user.admissionNumber);
        if (passingYear === year) {
            user.isAlumni = true;
            user.isVerified = true;
            user.passingYear = String(passingYear);
            await user.save();
            updated++;
            console.log(`Marked ${user.fullName || user._id} as alumni for year ${year}`);
        }
    }
    console.log(`Done. Marked ${updated} users as alumni for year ${year}.`);
    mongoose.disconnect();
}

main().catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
});
