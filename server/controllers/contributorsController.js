const contributorsSchema = require('../models/contributorsModel');
const { fetchAllCommits, fetchCommitsForYear, processCommits, formatResponse } = require('../utils/contributorsUtils');

const getContributors = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();

        const currentYearDoc = await contributorsSchema.findOne({ year: currentYear });

        const shouldUpdate = !currentYearDoc || (currentYearDoc && currentYearDoc.updatedAt < new Date(Date.now() - 24 * 60 * 60 * 1000));

        const isFirstRun = (await contributorsSchema.countDocuments()) === 0;

        if (isFirstRun || shouldUpdate) {
            try {
                const commits = isFirstRun ? await fetchAllCommits() : await fetchCommitsForYear(currentYear);

                if (Array.isArray(commits) && commits.length > 0) {
                    const commitsByYear = processCommits(commits);

                    if (isFirstRun) {
                        for (const year in commitsByYear) {
                            const yearData = commitsByYear[year];
                            await contributorsSchema.findOneAndUpdate(
                                { year: parseInt(year) },
                                { year: parseInt(year), total: yearData.total, contributors: yearData.contributors },
                                { upsert: true, new: true }
                            );
                        }
                    } else if (commitsByYear[currentYear]) {
                        const yearData = commitsByYear[currentYear];
                        await contributorsSchema.findOneAndUpdate(
                            { year: currentYear },
                            { total: yearData.total, contributors: yearData.contributors },
                            { upsert: true, new: true }
                        );
                    }
                }
            } catch (syncError) {
                console.error("Warning: Failed to sync latest contributors from GitHub:", syncError.message);
                // Proceed to return existing database records if GitHub fetch fails
            }
        }

        const allYearlyData = await contributorsSchema.find({}).sort({ year: -1 });
        const formattedResponse = formatResponse(allYearlyData);

        return res.status(200).json(formattedResponse);

    } catch (error) {
        console.error("Error fetching contributors details: ", error);
        return res.status(500).json({ error: "Error fetching contributors details" });
    }

}

module.exports = { getContributors }