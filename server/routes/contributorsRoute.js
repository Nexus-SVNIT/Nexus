const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/get', async (req, res) => {
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;

    try {
        let page = 1;
        let allCommits = [];
        let hasMoreCommits = true;

        while (hasMoreCommits) {
            const response = await axios.get(
                `https://api.github.com/repos/${owner}/${repo}/commits`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        per_page: 100,
                        page: page
                    }
                }
            );

            const commits = response.data;
            allCommits = [...allCommits, ...commits];
            hasMoreCommits = commits.length === 100;
            page++;
        }

        // Process commits into year-wise data
        const commitsByYear = allCommits.reduce((acc, commit) => {
            const year = new Date(commit.commit.author.date).getFullYear();
            const author = commit.author?.login || commit.commit.author.name;
            
            if (!acc[year]) {
                acc[year] = { total: 0, contributors: {} };
            }
            
            if (!acc[year].contributors[author]) {
                acc[year].contributors[author] = {
                    contributions: 0,
                    avatar_url: commit.author?.avatar_url,
                    html_url: commit.author?.html_url || `https://github.com/${author}`
                };
            }
            
            acc[year].contributors[author].contributions++;
            acc[year].total++;
            
            return acc;
        }, {});

        res.json(commitsByYear);
    } catch (error) {
        console.error('Error fetching commits:', error);
        res.status(500).json({ error: 'Error fetching commits' });
    }
});

module.exports = router;
