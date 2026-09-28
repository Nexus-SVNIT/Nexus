const axios = require('axios');
const User = require('../models/userModel');
const CodingProfile = require('../models/codingProfileModel');

/**
 * Fetches user stats directly from Codeforces API
 */
const fetchCodeforcesUserStats = async (handle) => {
    try {
        const userInfoResponse = await axios.get(
            `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`,
            { timeout: 10000 }
        );

        if (userInfoResponse.data?.status !== 'OK') {
            throw new Error('User not found');
        }

        const userInfo = userInfoResponse.data.result[0];

        // Fetch user's submission stats
        const submissionsResponse = await axios.get(
            `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}`,
            { timeout: 10000 }
        );

        let totalSolved = 0;
        const solvedProblems = new Set();

        if (submissionsResponse.data?.status === 'OK') {
            submissionsResponse.data.result.forEach(submission => {
                if (submission.verdict === 'OK') {
                    const problemKey = `${submission.problem.contestId}-${submission.problem.index}`;
                    solvedProblems.add(problemKey);
                }
            });
            totalSolved = solvedProblems.size;
        }

        return {
            handle: userInfo.handle,
            rating: userInfo.rating || 0,
            maxRating: userInfo.maxRating || 0,
            rank: userInfo.rank || 'unrated',
            maxRank: userInfo.maxRank || 'unrated',
            totalSolved,
            lastOnlineTime: userInfo.lastOnlineTimeSeconds ? new Date(userInfo.lastOnlineTimeSeconds * 1000) : null,
            registrationTime: userInfo.registrationTimeSeconds ? new Date(userInfo.registrationTimeSeconds * 1000) : null,
            contribution: userInfo.contribution || 0,
            avatar: userInfo.avatar || '',
            titlePhoto: userInfo.titlePhoto || ''
        };
    } catch (error) {
        console.error(`Error fetching Codeforces stats for ${handle}:`, error.message);
        return null;
    }
};

/**
 * Syncs an individual user's Codeforces stats
 */
const syncUserCodeforcesProfile = async (user) => {
    if (!user || !user.codeforcesProfile) return null;

    console.log(`Syncing Codeforces profile for ${user.fullName} (${user.codeforcesProfile})`);

    const stats = await fetchCodeforcesUserStats(user.codeforcesProfile);
    if (!stats) return null;

    // Calculate sorting key (prioritize rating, then total solved)
    const sortingKey = (stats.rating * 10000) + stats.totalSolved;

    const meta = {
        fullName: user.fullName,
        admissionNo: user.admissionNumber,
        branch: user.branch,
        year: user.passingYear,
        program: user.isAlumni ? 'Alumni' : 'Current',
        status: user.isAlumni ? 'Alumni' : 'Student'
    };

    const profileDoc = await CodingProfile.findOneAndUpdate(
        { userId: user._id, platform: 'codeforces' },
        {
            userId: user._id,
            platform: 'codeforces',
            profileId: user.codeforcesProfile,
            sortingKey,
            data: stats,
            ...meta
        },
        { upsert: true, new: true }
    );

    return profileDoc;
};

/**
 * Syncs all users with Codeforces profiles
 */
const syncAllCodeforcesProfiles = async (concurrency = 3) => {
    try {
        const users = await User.find({
            codeforcesProfile: { $exists: true, $ne: '' }
        }).select('_id fullName admissionNumber branch passingYear isAlumni codeforcesProfile shareCodingProfile');

        console.log(`Starting Codeforces profiles sync for ${users.length} users with concurrency=${concurrency}...`);
        let syncedCount = 0;
        let processedCount = 0;

        // Process in batches to avoid rate limiting
        for (let i = 0; i < users.length; i += concurrency) {
            const batch = users.slice(i, i + concurrency);
            await Promise.all(
                batch.map(async (user) => {
                    try {
                        const res = await syncUserCodeforcesProfile(user);
                        if (res) syncedCount++;
                    } catch (err) {
                        console.error(`Error syncing Codeforces profile for ${user.fullName}:`, err.message);
                    } finally {
                        processedCount++;
                    }
                })
            );

            if (processedCount % 10 === 0 || processedCount === users.length) {
                console.log(`[Codeforces Sync Progress] ${processedCount}/${users.length} processed (${syncedCount} synced)...`);
            }

            // Rate limiting - wait 2 seconds between batches
            if (i + concurrency < users.length) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        console.log(`Successfully synced ${syncedCount}/${users.length} Codeforces profiles.`);
        return { total: users.length, synced: syncedCount };

    } catch (error) {
        console.error('Error during batch Codeforces profiles sync:', error.message);
        throw error;
    }
};

module.exports = {
    fetchCodeforcesUserStats,
    syncUserCodeforcesProfile,
    syncAllCodeforcesProfiles
};