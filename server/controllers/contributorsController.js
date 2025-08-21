const contributorsSchema = require('../models/contributorsModel');
const { formatResponse } = require('../utils/contributorsUtils');

const getContributors = async (req, res) => {
    try {
        const allYearlyData = await contributorsSchema.find({}).sort({ year: -1 });
        const formattedResponse = formatResponse(allYearlyData);

        return res.status(200).json(formattedResponse);

    } catch (error) {
        console.error("Error fetching contributors details: ", error);
        return res.status(500).json({ error: "Error fetching contributors details" });
    }

}

module.exports = { getContributors }