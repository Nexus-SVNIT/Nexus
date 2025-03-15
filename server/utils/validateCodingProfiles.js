const validateCodingProfiles = (leetcode, codeforces, codechef) => {
    const urlPattern = /^https?:\/\/|www\.|\.com|\/|@/i;
    
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

exports.validateCodingProfiles = validateCodingProfiles;