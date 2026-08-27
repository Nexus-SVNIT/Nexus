const axios = require('axios');

const getGitHubConfig = () => {
    const owner = process.env.GITHUB_OWNER || 'Nexus-SVNIT';
    const repo = process.env.GITHUB_REPO || 'Nexus';
    const rawToken = process.env.GITHUB_TOKEN;
    const token = rawToken && rawToken.trim() !== '' && rawToken !== 'undefined' ? rawToken.trim() : null;
    return { owner, repo, token };
};

const makeGitHubRequest = async (url, params = {}) => {
    const { token } = getGitHubConfig();
    const headers = {
        'User-Agent': 'Nexus-App',
        'Accept': 'application/vnd.github.v3+json'
    };

    if (token) {
        headers['Authorization'] = token.startsWith('Bearer ') || token.startsWith('token ') ? token : `Bearer ${token}`;
    }

    try {
        return await axios.get(url, { headers, params });
    } catch (error) {
        // If request failed with 401 Unauthorized (e.g. revoked/invalid token) and an Authorization header was sent,
        // retry once without Authorization header to access public GitHub repository data.
        if (error.response && error.response.status === 401 && headers['Authorization']) {
            console.warn(`[GitHub API] 401 Unauthorized with provided token. Retrying unauthenticated request to ${url}...`);
            const retryHeaders = {
                'User-Agent': 'Nexus-App',
                'Accept': 'application/vnd.github.v3+json'
            };
            return await axios.get(url, { headers: retryHeaders, params });
        }
        throw error;
    }
};

const fetchAllCommits = async () => {
    const { owner, repo } = getGitHubConfig();
    let page = 1;
    let allCommits = [];
    let hasMoreCommits = true;
    while (hasMoreCommits) {
        const response = await makeGitHubRequest(`https://api.github.com/repos/${owner}/${repo}/commits`, {
            per_page: 100,
            page: page
        });
        const commits = response.data;
        if (!Array.isArray(commits) || commits.length === 0) {
            break;
        }
        allCommits.push(...commits);
        hasMoreCommits = commits.length === 100;
        page++;
    }
    return allCommits;
};

const fetchCommitsForYear = async (year) => {
    const { owner, repo } = getGitHubConfig();
    const since = `${year}-01-01T00:00:00Z`;
    const until = `${year}-12-31T23:59:59Z`;
    let allCommits = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await makeGitHubRequest(`https://api.github.com/repos/${owner}/${repo}/commits`, {
            per_page: 100,
            page,
            since,
            until
        });
        const commits = response.data;
        if (!Array.isArray(commits) || commits.length === 0) {
            break;
        }
        allCommits.push(...commits);
        hasMore = commits.length === 100;
        page++;
    }
    return allCommits;
};

const processCommits = (commits) => {
    const { owner, repo } = getGitHubConfig();
    return commits.reduce((acc, commit) => {
        if (!commit || !commit.commit || !commit.commit.author || !commit.commit.author.date) {
            return acc;
        }
        const date = new Date(commit.commit.author.date);
        const year = date.getFullYear();
        if (isNaN(year)) return acc;

        if (!acc[year]) {
            acc[year] = { year, total: 0, contributors: [] };
        }
        
        const authorLogin = commit.author?.login || commit.commit.author.name || 'Anonymous';
        const avatarUrl = commit.author?.avatar_url || `https://github.com/identicons/${encodeURIComponent(authorLogin)}.png`;
        const htmlUrl = commit.author?.html_url || (commit.author?.login ? `https://github.com/${commit.author.login}` : `https://github.com/${owner}/${repo}`);

        const contributor = acc[year].contributors.find(c => c.githubId === authorLogin);
        if (contributor) {
            contributor.contributions++;
        } else {
            acc[year].contributors.push({
                githubId: authorLogin,
                contributions: 1,
                avatar_url: avatarUrl,
                html_url: htmlUrl
            });
        }
        acc[year].total++;
        return acc;
    }, {});
};

const formatResponse = (allYearlyData) => {
    return allYearlyData.reduce((acc, doc) => {
        acc[doc.year] = {
            total: doc.total,
            contributors: (doc.contributors || []).map(contributor => ({
                githubId: contributor.githubId,
                contributions: contributor.contributions,
                avatar_url: contributor.avatar_url,
                html_url: contributor.html_url
            }))
        };
        return acc;
    }, {});
};

module.exports = {
    fetchAllCommits,
    fetchCommitsForYear,
    processCommits,
    formatResponse
};