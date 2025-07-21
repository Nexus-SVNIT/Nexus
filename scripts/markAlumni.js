const mongoose = require('mongoose');
const User = require('../server/models/userModel');
const fs = require('fs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexus';

function getProgramDuration(prefix) {
    if (prefix === 'U') return 4;
    if (prefix === 'P') return 2;
    if (prefix === 'D' || prefix === 'I') return 5;
    return null;
}

function getAdmissionYear(admissionNumber) {
    // Example: U22xxxx -> 2022
    const match = admissionNumber.match(/^([UPDI])(\d{2})/i);
    if (!match) return null;
    const year = parseInt(match[2], 10);
    return year >= 0 && year <= 99 ? 2000 + year : null;
}

async function markAlumni() {
    await mongoose.connect(MONGO_URI);

    const users = await User.find({ isAlumni: { $ne: true } });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0 = Jan, 5 = June

    let markedCount = 0;

    for (const user of users) {
        const admissionNumber = user.admissionNumber;
        if (!admissionNumber) continue;

        const prefix = admissionNumber[0].toUpperCase();
        const duration = getProgramDuration(prefix);
        const admissionYear = getAdmissionYear(admissionNumber);

        if (!duration || !admissionYear) continue;

        const alumniYear = admissionYear + duration;
        // Alumni status starts from June of alumniYear
        const isAlumni = (currentYear > alumniYear) ||
            (currentYear === alumniYear && currentMonth >= 5);

        if (isAlumni) {
            user.isAlumni = true;
            user.isVerified = true;
            await user.save();
            markedCount++;
            console.log(`Marked alumni: ${user.fullName} (${admissionNumber})`);
        }
    }

    // Write the count to a file for the report script
    fs.writeFileSync('alumni_marked_count.txt', markedCount.toString());

    await mongoose.disconnect();
}

markAlumni().catch(err => {
    console.error('Error marking alumni:', err);
    process.exit(1);
});
