/**
 * Automated script to synchronize GitHub profiles and stats for all registered users.
 * Can be run locally, via npm, or inside GitHub Actions workflows.
 *
 * Usage:
 *   node server/scripts/syncGitHubProfiles.js
 *   MONGO_URL="<connection_string>" node server/scripts/syncGitHubProfiles.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { syncAllGitHubProfiles, verifyGitHubToken } = require('../utils/githubProfileUtils');

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    console.error('[GitHub Sync Script] ERROR: MONGO_URL environment variable is missing.');
    process.exit(1);
}

const main = async () => {
    console.log('[GitHub Sync Script] Starting GitHub profiles sync...');
    console.log(`[GitHub Sync Script] Connecting to MongoDB...`);

    try {
        await mongoose.connect(MONGO_URL, {
            serverSelectionTimeoutMS: 15000,
            maxPoolSize: 10
        });
        console.log('[GitHub Sync Script] Connected to database successfully.');

        const isTokenValid = await verifyGitHubToken();
        if (!isTokenValid) {
            console.warn('[GitHub Sync Script] Proceeding with unauthenticated / fallback requests (subject to rate limits).');
        }

        const startTime = Date.now();
        const result = await syncAllGitHubProfiles(5);
        const durationSec = Math.round((Date.now() - startTime) / 1000);

        console.log(`[GitHub Sync Script] Complete! Synced ${result.synced}/${result.total} profiles in ${durationSec}s.`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('[GitHub Sync Script] Fatal error during sync:', err);
        try {
            await mongoose.disconnect();
        } catch (_) {}
        process.exit(1);
    }
};

main();
