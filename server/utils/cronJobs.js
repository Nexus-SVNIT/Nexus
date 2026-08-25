const { syncAllGitHubProfiles } = require('./githubProfileUtils');

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
