const axios = require('axios');

/**
 * Synchronous check: ensures the user entered a username, not a URL.
 */
const rejectUrls = (leetcode, codeforces, codechef) => {
    const urlPattern = /^https?:\/\/|www\.|\\.com|\/|@/i;

    if (leetcode && urlPattern.test(leetcode)) {
        throw new Error('Please enter only your LeetCode username, not the full URL');
    }
    if (codeforces && urlPattern.test(codeforces)) {
        throw new Error('Please enter only your Codeforces username, not the full URL');
    }
    if (codechef && urlPattern.test(codechef)) {
        throw new Error('Please enter only your CodeChef username, not the full URL');
    }
};

/**
 * Verify a LeetCode username exists via their GraphQL API.
 * Returns true if the user exists, false otherwise.
 */
const verifyLeetcode = async (username) => {
    try {
        const response = await axios.post(
            'https://leetcode.com/graphql',
            {
                query: `
                    query userPublicProfile($username: String!) {
                        matchedUser(username: $username) {
                            username
                        }
                    }
                `,
                variables: { username },
            },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 8000,
            }
        );

        return response.data?.data?.matchedUser !== null;
    } catch (error) {
        // If the API is unreachable, we don't want to block the user.
        // Log it and let it pass — better to allow than block on API downtime.
        console.error(`LeetCode verification failed for '${username}':`, error.message);
        return true; // fail-open
    }
};

/**
 * Verify a Codeforces handle exists via their public REST API.
 * Returns true if the user exists, false otherwise.
 */
const verifyCodeforces = async (handle) => {
    try {
        const response = await axios.get(
            `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`,
            { timeout: 8000 }
        );

        return response.data?.status === 'OK';
    } catch (error) {
        // Codeforces returns 400 for invalid handles
        if (error.response && error.response.status === 400) {
            return false;
        }
        // API is unreachable — fail-open
        console.error(`Codeforces verification failed for '${handle}':`, error.message);
        return true;
    }
};

/**
 * Verify a CodeChef username exists.
 * Returns true if the user exists, false otherwise.
 */
const verifyCodechef = async (username) => {
    try {
        const response = await axios.get(
            `https://codechef-api.vercel.app/handle/${encodeURIComponent(username)}`,
            { timeout: 8000 }
        );

        // The API returns success:true for valid users
        return response.data?.success === true;
    } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 400)) {
            return false;
        }
        // API is unreachable — fail-open
        console.error(`CodeChef verification failed for '${username}':`, error.message);
        return true;
    }
};

/**
 * Main validation function. Now async.
 * 1. Rejects URLs (synchronous check).
 * 2. Verifies each non-empty ID actually exists on the platform (parallel API calls).
 * 
 * Returns: { valid: boolean, errors: string[] }
 */
const validateCodingProfiles = async (leetcode, codeforces, codechef) => {
    // Step 1: Synchronous URL check (throws on failure)
    rejectUrls(leetcode, codeforces, codechef);

    // Step 2: Build verification promises only for non-empty IDs
    const checks = [];

    if (leetcode) {
        checks.push(
            verifyLeetcode(leetcode).then(valid => ({
                platform: 'LeetCode',
                id: leetcode,
                valid,
            }))
        );
    }

    if (codeforces) {
        checks.push(
            verifyCodeforces(codeforces).then(valid => ({
                platform: 'Codeforces',
                id: codeforces,
                valid,
            }))
        );
    }

    if (codechef) {
        checks.push(
            verifyCodechef(codechef).then(valid => ({
                platform: 'CodeChef',
                id: codechef,
                valid,
            }))
        );
    }

    if (checks.length === 0) {
        return { valid: true, errors: [] };
    }

    // Run all checks in parallel
    const results = await Promise.allSettled(checks);
    const errors = [];

    for (const result of results) {
        if (result.status === 'fulfilled' && !result.value.valid) {
            errors.push(`${result.value.platform} ID '${result.value.id}' does not exist. Please enter a valid username.`);
        }
        // If a promise was rejected (unexpected), fail-open — don't block the user
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

module.exports = { validateCodingProfiles };