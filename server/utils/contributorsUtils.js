const axios = require('axios');

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;

const fetchAllCommits = async () => {
    let page = 1;
    let allCommits = [];
    let hasMoreCommits = true;
    while (hasMoreCommits) {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { per_page: 100, page: page }
        });
        const commits = response.data;
        allCommits.push(...commits);
        hasMoreCommits = commits.length === 100;
        page++;
    }
    return allCommits;
}

const fetchCommitsForYear = async (year) => {
    const since = `${year}-01-01T00:00:00Z`;
    const until = `${year}-12-31T23:59:59Z`;
    let allCommits = [];
    let page = 1;
    let hasMore = true;

    // console.log(`Fetching commits for year ${year}...`);
    while (hasMore) {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { per_page: 100, page, since, until }
        });
        allCommits.push(...response.data);
        hasMore = response.data.length === 100;
        page++;
    }
    return allCommits;
}

const processCommits = (commits) => {
    return commits.reduce((acc, commit) => {
        const date = new Date(commit.commit.author.date);
        const year = date.getFullYear();
        if (!acc[year]) {
            acc[year] = { year, total: 0, contributors: [] };
        }
        
        const contributor = acc[year].contributors.find(c => c.githubId === commit.author.login);
        if (contributor) {
            contributor.contributions++;
        } else {
            acc[year].contributors.push({
                githubId: commit.author.login,
                contributions: 1,
                avatar_url: commit.author.avatar_url,
                html_url: commit.author.html_url
            });
        }
        acc[year].total++;
        return acc;
    }, {});
}

const formatResponse = (allYearlyData) => {
    return allYearlyData.reduce((acc, doc) => {
        acc[doc.year] = {
            total: doc.total,
            contributors: doc.contributors.map(contributor => ({
                githubId: contributor.githubId,
                contributions: contributor.contributions,
                avatar_url: contributor.avatar_url,
                html_url: contributor.html_url
            }))
        };
        return acc;
    }, {});
}

module.exports = {
    fetchAllCommits,
    fetchCommitsForYear,
    processCommits,
    formatResponse
};