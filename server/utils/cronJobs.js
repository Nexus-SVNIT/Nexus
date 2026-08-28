const { syncAllGitHubProfiles, verifyGitHubToken } = require('./githubProfileUtils');
const CodingProfile = require('../models/codingProfileModel');
const User = require('../models/userModel');

let cron;
try {
    cron = require('node-cron');
} catch {
    cron = null;
}

/**
 * Initializes scheduled automated background jobs.
 */
const initCronJobs = () => {
    console.log('[Cron] Initializing daily GitHub profiles sync scheduler...');

    // Run verification on startup
    verifyGitHubToken();

    // Trigger initial background sync on startup if no GitHub profiles exist in the DB
    (async () => {
        try {
            const usersCount = await User.countDocuments({ githubProfile: { $exists: true, $ne: '' } });
            if (usersCount > 0) {
                const count = await CodingProfile.countDocuments({ platform: 'github' });
                if (count < usersCount) {
                    console.log(`[GitHub Sync] Found ${usersCount} users with GitHub profiles but only ${count} stats documents in the database. Starting initial background sync...`);
                    syncAllGitHubProfiles().then(result => {
                        console.log(`[GitHub Sync] Initial background sync completed: ${result.synced}/${result.total} profiles updated.`);
                    }).catch(err => {
                        console.error('[GitHub Sync] Initial background sync failed:', err.message);
                    });
                } else {
                    console.log(`[GitHub Sync] Database already contains stats for all ${count} GitHub profiles. Skipping initial startup sync.`);
                }
            } else {
                console.log('[GitHub Sync] No users with GitHub profiles found in the database. Skipping initial startup sync.');
            }
        } catch (err) {
            console.error('[GitHub Sync] Error during startup checks:', err.message);
        }
    })();

    if (cron) {
        // Runs daily at 00:00 UTC (0 0 * * *)
        cron.schedule('0 0 * * *', async () => {
            console.log(`[Cron] [${new Date().toISOString()}] Starting automated daily GitHub profiles sync...`);
            try {
                const result = await syncAllGitHubProfiles();
                console.log(`[Cron] Daily sync completed: ${result.synced}/${result.total} profiles updated.`);
            } catch (err) {
                console.error('[Cron] Daily sync error:', err.message);
            }
        });
        console.log('[Cron] Daily GitHub sync scheduled with node-cron at 00:00 UTC every day.');
    } else {
        // Fallback: 24-hour interval timer
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
        setInterval(async () => {
            console.log(`[Scheduler] [${new Date().toISOString()}] Starting daily GitHub profiles sync...`);
            try {
                const result = await syncAllGitHubProfiles();
                console.log(`[Scheduler] Daily sync completed: ${result.synced}/${result.total} profiles updated.`);
            } catch (err) {
                console.error('[Scheduler] Daily sync error:', err.message);
            }
        }, TWENTY_FOUR_HOURS);
        console.log('[Scheduler] Daily GitHub sync scheduled via 24-hour interval timer.');
    }
};

module.exports = { initCronJobs };

