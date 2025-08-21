const contributionsSchema = require('../models/contributorsModel');
const { fetchAllCommits, fetchCommitsForYear, processCommits, formatResponse } = require('../utils/contributorsUtils');

const getContributors = async (req, res) => {
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

        const allYearlyData = await contributionsSchema.find({}).sort({ year: -1 });
        const formattedResponse = formatResponse(allYearlyData);

        return res.status(200).json(formattedResponse);

    } catch (error) {
        console.error("Error fetching contributors details: ", error);
        return res.status(500).json({ error: "Error fetching contributors details" });
    }

}

module.exports = { getContributors }