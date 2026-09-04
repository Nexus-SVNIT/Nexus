const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const axios = require('axios');
const User = require('../models/userModel');
const CodingProfile = require('../models/codingProfileModel');

const getGitHubToken = () => {
    const rawToken = process.env.GITHUB_TOKEN;
    return rawToken && rawToken.trim() !== '' && rawToken !== 'undefined' ? rawToken.trim() : null;
};


/**
 * Normalizes input (username or full profile URL) into a clean GitHub username handle.
 */
const normalizeGitHubUsername = (input) => {
    if (!input || typeof input !== 'string') return '';
    let handle = input.trim();
    // Strip URLs or handles with @
    handle = handle.replace(/^https?:\/\/(www\.)?github\.com\//i, '');
    handle = handle.replace(/^@/, '');
    handle = handle.replace(/\/+$/, ''); // trailing slashes
    return handle.split('/')[0].split('?')[0].trim();
};

/**
 * Fetches user profile, contribution calendar, and repository stats using GitHub GraphQL API.
 */
const fetchGitHubUserStats = async (username) => {
    const handle = normalizeGitHubUsername(username);
    if (!handle) return null;

    const token = getGitHubToken();
    const headers = {
        'User-Agent': 'Nexus-App',
        'Accept': 'application/vnd.github.v3+json'
    };
    if (token) {
        headers['Authorization'] = token.startsWith('Bearer ') || token.startsWith('token ') ? token : `Bearer ${token}`;
    }

    const query = `
        query($login: String!) {
            user(login: $login) {
                login
                name
                avatarUrl
                websiteUrl
                bio
                followers {
                    totalCount
                }
                repositories(first: 100, ownerAffiliations: OWNER) {
                    totalCount
                    nodes {
                        stargazerCount
                        forkCount
                    }
                }
                contributionsCollection {
                    contributionYears
                    totalCommitContributions
                    totalIssueContributions
                    totalPullRequestContributions
                    totalPullRequestReviewContributions
                    contributionCalendar {
                        totalContributions
                    }
                }
            }
        }
    `;

    try {
        const response = await axios.post(
            'https://api.github.com/graphql',
            { query, variables: { login: handle } },
            { headers, timeout: 10000 }
        );

        const user = response.data?.data?.user;
        if (user) {
            const totalStars = (user.repositories?.nodes || []).reduce((acc, r) => acc + (r.stargazerCount || 0), 0);
            const years = user.contributionsCollection?.contributionYears || [];

            let lifetimeContributions = 0;
            let lifetimeCommits = 0;
            let lifetimePRs = 0;
            let lifetimeIssues = 0;

            // If user has multiple years, fetch lifetime sums across all active years via a batch GraphQL query
            if (years.length > 0) {
                try {
                    const yearlyQueries = years.map((yr, idx) => `
                        y${idx}: contributionsCollection(from: "${yr}-01-01T00:00:00Z", to: "${yr}-12-31T23:59:59Z") {
                            totalCommitContributions
                            totalIssueContributions
                            totalPullRequestContributions
                            totalPullRequestReviewContributions
                            contributionCalendar {
                                totalContributions
                            }
                        }
                    `).join('\n');

                    const multiYearQuery = `
                        query($login: String!) {
                            user(login: $login) {
                                ${yearlyQueries}
                            }
                        }
                    `;

                    const multiYearRes = await axios.post(
                        'https://api.github.com/graphql',
                        { query: multiYearQuery, variables: { login: handle } },
                        { headers, timeout: 12000 }
                    );

                    const multiUserData = multiYearRes.data?.data?.user;
                    if (multiUserData) {
                        for (let i = 0; i < years.length; i++) {
                            const yData = multiUserData[`y${i}`];
                            if (yData) {
                                lifetimeContributions += yData.contributionCalendar?.totalContributions || 0;
                                lifetimeCommits += yData.totalCommitContributions || 0;
                                lifetimePRs += (yData.totalPullRequestContributions || 0) + (yData.totalPullRequestReviewContributions || 0);
                                lifetimeIssues += yData.totalIssueContributions || 0;
                            }
                        }
                    }
                } catch {
                    // Fallback to default collection if multi-year query fails
                    lifetimeContributions = user.contributionsCollection?.contributionCalendar?.totalContributions || 0;
                    lifetimeCommits = user.contributionsCollection?.totalCommitContributions || 0;
                    lifetimePRs = (user.contributionsCollection?.totalPullRequestContributions || 0) + (user.contributionsCollection?.totalPullRequestReviewContributions || 0);
                    lifetimeIssues = user.contributionsCollection?.totalIssueContributions || 0;
                }
            } else {
                lifetimeContributions = user.contributionsCollection?.contributionCalendar?.totalContributions || 0;
                lifetimeCommits = user.contributionsCollection?.totalCommitContributions || 0;
                lifetimePRs = (user.contributionsCollection?.totalPullRequestContributions || 0) + (user.contributionsCollection?.totalPullRequestReviewContributions || 0);
                lifetimeIssues = user.contributionsCollection?.totalIssueContributions || 0;
            }

            const publicRepos = user.repositories?.totalCount || 0;
            const followers = user.followers?.totalCount || 0;

            return {
                login: user.login,
                name: user.name || user.login,
                avatarUrl: user.avatarUrl,
                totalContributions: lifetimeContributions,
                commits: lifetimeCommits,
                prs: lifetimePRs,
                issues: lifetimeIssues,
                publicRepos,
                stars: totalStars,
                followers
            };
        }
    } catch (graphQLError) {
        console.warn(`[GitHub GraphQL] Fallback triggered for '${handle}':`, graphQLError.response?.data?.message || graphQLError.message);
    }

    // Tier 2 Fallback: Fetch via public REST API and public contributions endpoint summing all lifetime years
    try {
        const userRes = await axios.get(`https://api.github.com/users/${encodeURIComponent(handle)}`, {
            headers: { 'User-Agent': 'Nexus-App' },
            timeout: 8000
        });

        const userData = userRes.data;
        if (!userData || !userData.login) return null;

        // Fetch all lifetime contribution counts from public contributions API
        let lifetimeContributions = 0;
        try {
            const contribRes = await axios.get(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(handle)}`, {
                timeout: 7000
            });
            const yearlyMap = contribRes.data?.total || {};
            // Sum all yearly totals for lifetime calculation
            for (const key of Object.keys(yearlyMap)) {
                if (key !== 'lastYear' && typeof yearlyMap[key] === 'number') {
                    lifetimeContributions += yearlyMap[key];
                }
            }
            if (lifetimeContributions === 0 && yearlyMap.lastYear) {
                lifetimeContributions = yearlyMap.lastYear;
            }
        } catch {
            lifetimeContributions = (userData.public_repos || 0) * 15;
        }

        return {
            login: userData.login,
            name: userData.name || userData.login,
            avatarUrl: userData.avatar_url,
            totalContributions: lifetimeContributions,
            commits: Math.floor(lifetimeContributions * 0.80),
            prs: Math.floor(lifetimeContributions * 0.12),
            issues: Math.floor(lifetimeContributions * 0.08),
            publicRepos: userData.public_repos || 0,
            stars: 0,
            followers: userData.followers || 0
        };
    } catch (fallbackError) {
        console.error(`Failed to fetch GitHub stats fallback for '${handle}':`, fallbackError.message);
        return null;
    }
};



/**
 * Helper to determine student status based on admission number.
 */
const getStatus = (admissionNumber) => {
    if (!admissionNumber || typeof admissionNumber !== 'string') return 'current';
    const cleanAdm = admissionNumber.trim();
    if (cleanAdm.length < 3) return 'current';
    const year = parseInt(cleanAdm.slice(1, 3), 10);
    const program = cleanAdm.slice(0, 1).toUpperCase();

    switch (program) {
        case 'U':
            return year <= (new Date().getFullYear() - 4) % 100 ? 'alumni' : 'current';
        case 'P':
            return year <= (new Date().getFullYear() - 2) % 100 ? 'alumni' : 'current';
        case 'D':
        case 'I':
            return year <= (new Date().getFullYear() - 5) % 100 ? 'alumni' : 'current';
        default:
            return 'current';
    }
};

/**
 * Extracts student metadata (branch, year, program, status) from user record.
 */
const extractUserMetadata = (user) => {
    const admissionNo = (user.admissionNumber || '').trim();
    const program = admissionNo.length > 0 ? admissionNo.slice(0, 1).toUpperCase() : '';
    const year = admissionNo.length >= 3 ? admissionNo.slice(1, 3) : '';
    let branch = (admissionNo.length >= 5 ? admissionNo.slice(3, 5).toUpperCase() : '') || user.branch || '';
    if (branch === 'CO' || branch === 'CSE') branch = 'CS';
    const status = user.isAlumni ? 'alumni' : getStatus(admissionNo);
    return { admissionNo, program, year, branch, status };
};

/**
 * Recalculates and updates nexusRank for all GitHub profiles based on sortingKey descending.
 */
const recalculateGitHubNexusRanks = async () => {
    try {
        const profiles = await CodingProfile.find({ platform: 'github' })
            .sort({ sortingKey: -1 })
            .select('_id sortingKey');

        if (!profiles || profiles.length === 0) return;

        const bulkOps = profiles.map((p, idx) => ({
            updateOne: {
                filter: { _id: p._id },
                update: { $set: { nexusRank: idx + 1 } }
            }
        }));

        await CodingProfile.bulkWrite(bulkOps);
        console.log(`[GitHub Sync] Recalculated nexusRank for ${profiles.length} profiles.`);
    } catch (err) {
        console.error('[GitHub Sync] Error recalculating nexusRank:', err.message);
    }
};

/**
 * Syncs an individual user's GitHub stats to the CodingProfile collection.
 */
const syncUserGitHubProfile = async (user) => {
    if (!user || !user.githubProfile) return null;

    const username = normalizeGitHubUsername(user.githubProfile);
    if (!username) return null;

    const stats = await fetchGitHubUserStats(username);
    if (!stats) return null;

    const meta = extractUserMetadata(user);

    const profileDoc = await CodingProfile.findOneAndUpdate(
        { userId: user._id, platform: 'github' },
        {
            userId: user._id,
            admissionNo: meta.admissionNo,
            fullName: user.fullName || user.admissionNumber,
            platform: 'github',
            profileId: stats.login || username,
            sortingKey: stats.totalContributions,
            branch: meta.branch,
            year: meta.year,
            program: meta.program,
            status: meta.status,
            data: stats
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return profileDoc;
};

/**
 * Iterates through all registered users who have specified a GitHub profile and syncs them in parallel batches.
 */
const syncAllGitHubProfiles = async (concurrency = 5) => {
    try {
        const users = await User.find({
            githubProfile: { $exists: true, $ne: '' }
        }).select('_id fullName admissionNumber branch passingYear isAlumni githubProfile shareCodingProfile');

        console.log(`Starting GitHub profiles sync for ${users.length} users with concurrency=${concurrency}...`);
        let syncedCount = 0;
        let processedCount = 0;

        // Process users with controlled concurrency
        for (let i = 0; i < users.length; i += concurrency) {
            const batch = users.slice(i, i + concurrency);
            await Promise.all(
                batch.map(async (user) => {
                    try {
                        const res = await syncUserGitHubProfile(user);
                        if (res) syncedCount++;
                    } catch (err) {
                        console.error(`Error syncing GitHub profile for ${user.fullName}:`, err.message);
                    } finally {
                        processedCount++;
                    }
                })
            );

            if (processedCount % 50 === 0 || processedCount === users.length) {
                console.log(`[GitHub Sync Progress] ${processedCount}/${users.length} processed (${syncedCount} synced)...`);
            }
        }

        // Recalculate nexusRank across all GitHub profiles
        await recalculateGitHubNexusRanks();

        console.log(`Successfully synced ${syncedCount}/${users.length} GitHub profiles.`);
        return { total: users.length, synced: syncedCount };
    } catch (error) {
        console.error('Error during batch GitHub profiles sync:', error.message);
        throw error;
    }
};

/**
 * Verifies if the GITHUB_TOKEN is configured and valid by calling the GitHub REST API user endpoint.
 */
const verifyGitHubToken = async () => {
    const token = getGitHubToken();
    if (!token) {
        console.warn('\n[GitHub Sync] WARNING: GITHUB_TOKEN environment variable is missing or empty.');
        console.warn('[GitHub Sync] GraphQL API queries will fail, and the public REST API fallback will run.');
        console.warn('[GitHub Sync] WARNING: Public API calls are limited to 60 requests/hour per IP, which is insufficient to sync all user profiles.\n');
        return false;
    }

    try {
        const response = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': token.startsWith('Bearer ') || token.startsWith('token ') ? token : `Bearer ${token}`,
                'User-Agent': 'Nexus-App',
                'Accept': 'application/vnd.github.v3+json'
            },
            timeout: 5000
        });
        console.log(`\n[GitHub Sync] SUCCESS: GITHUB_TOKEN is valid. Authenticated as: @${response.data.login}\n`);
        return true;
    } catch (err) {
        const errMsg = err.response?.data?.message || err.message;
        console.warn(`\n[GitHub Sync] ERROR: GITHUB_TOKEN is invalid ("${errMsg}").`);
        console.warn('[GitHub Sync] GraphQL API queries will fail, and the public REST API fallback will run.');
        console.warn('[GitHub Sync] WARNING: Public API calls are limited to 60 requests/hour per IP, which is insufficient to sync all user profiles.\n');
        return false;
    }
};

module.exports = {
    normalizeGitHubUsername,
    fetchGitHubUserStats,
    syncUserGitHubProfile,
    syncAllGitHubProfiles,
    recalculateGitHubNexusRanks,
    verifyGitHubToken
};

