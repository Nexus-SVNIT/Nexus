require('dotenv').config();

const mongoose = require('mongoose');
const axios = require('axios');

const MONGO_URL = process.env.MONGO_URL;
const owner = process.env.GIT_OWNER;
const repo = process.env.GIT_REPO;
const token = process.env.GIT_TOKEN;
if (!MONGO_URL) {
    console.error('Error: MONGO_URL environment variable is not set. Please set it before running this script.');
    process.exit(1);
}

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

const fetchContributors = async() => {
    try {
        const currentYear = new Date().getFullYear();

        const currentYearDoc = await contributionsSchema.findOne({ year: currentYear });

        const shouldUpdate = !currentYearDoc || (currentYearDoc && currentYearDoc.updatedAt < new Date(Date.now() - 24 * 60 * 60 * 1000));

        const isFirstRun = (await contributionsSchema.countDocuments()) === 0;

        if (isFirstRun || shouldUpdate) {
            const commits = isFirstRun ? await fetchAllCommits() : await fetchCommitsForYear(currentYear);

            const commitsByYear = processCommits(commits);

            if(isFirstRun) {
                for(const year in commitsByYear) {
                    const yearData = commitsByYear[year];
                    const newContributions = new contributionsSchema({
                        year: parseInt(year),
                        total: yearData.total,
                        contributors: yearData.contributors
                    });
                    await newContributions.save();
                }
            } else if(commitsByYear[currentYear]) {
                const yearData = commitsByYear[currentYear];
                await contributionsSchema.findOneAndUpdate(
                    { year: currentYear },
                    { total: yearData.total, contributors: yearData.contributors }
                );
            }
        }
    } catch (error) {
        console.error("Error fetching contributors details: ", error);
        return;
    }
}

async function main() {
    console.log('Connecting to MongoDB with URL:');
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
        console.log('MongoDB connection established.');
    } catch (connErr) {
        console.error('MongoDB connection error:', connErr);
        mongoose.disconnect();
        process.exit(1);
    }
    try {
        await fetchContributors();
        console.log('Contributors fetched and updated successfully.');
    } catch (queryErr) {
        console.error('Error during fetching contributors:', queryErr);
    }
    mongoose.disconnect();
}

main().catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
});
