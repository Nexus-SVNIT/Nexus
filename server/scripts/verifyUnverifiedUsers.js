/**
 * Script to verify all unverified users in MongoDB.
 *
 * Usage:
 *   node server/scripts/verifyUnverifiedUsers.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/userModel');

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    console.error('[Verify Users Script] ERROR: MONGO_URL environment variable is missing.');
    process.exit(1);
}

const main = async () => {
    console.log('[Verify Users Script] Connecting to database...');
    try {
        await mongoose.connect(MONGO_URL, {
            serverSelectionTimeoutMS: 15000,
            maxPoolSize: 10
        });
        console.log('[Verify Users Script] Connected successfully.');

        // Find all unverified users
        const unverifiedUsers = await User.find({
            $or: [{ emailVerified: false }, { emailVerified: { $exists: false } }]
        }).select('fullName admissionNumber instituteEmail personalEmail isAlumni createdAt');

        console.log(`[Verify Users Script] Found ${unverifiedUsers.length} unverified user(s).`);

        if (unverifiedUsers.length === 0) {
            console.log('[Verify Users Script] No unverified users found. Nothing to update.');
            await mongoose.disconnect();
            process.exit(0);
        }

        console.log('\nUnverified Users:');
        unverifiedUsers.forEach((u, idx) => {
            console.log(
                `  ${idx + 1}. [${u.admissionNumber}] ${u.fullName} | Inst: ${u.instituteEmail || 'N/A'} | Personal: ${u.personalEmail || 'N/A'} | Alumni: ${!!u.isAlumni}`
            );
        });

        // Update all unverified users
        const result = await User.updateMany(
            {
                $or: [{ emailVerified: false }, { emailVerified: { $exists: false } }]
            },
            {
                $set: { emailVerified: true },
                $unset: { verificationToken: "" }
            }
        );

        console.log(`\n[Verify Users Script] SUCCESS: Verified ${result.modifiedCount} user(s).`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('[Verify Users Script] ERROR:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

main();
