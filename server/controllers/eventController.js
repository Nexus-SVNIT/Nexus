const Event = require("../models/eventModel.js");

const getAllEvents = async (req, res) => {
    try {
        const allEvents = await Event.find();
        return res.status(200).json({ success: true, data: allEvents });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const getEventsByYear = async (req, res) => {
    try {
        const year = parseInt(req.params.year.slice(0, 4));
        const start = `${year}-07-01`;
        const end = `${year + 1}-07-01`;

        const events = await Event.find({
            eventDate: { $gte: start, $lt: end }
        });

        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving events", error: error.message });
    }
};

const getUniqueYears = async (req, res) => {
    try {
        // Fetch unique years from the events collection
        const dates = await Event.distinct("eventDate");
        const setYears = new Set(dates.map(date => {
            const DateObject = new Date(date);
            const curMonth = DateObject.getMonth();
            let curYear = DateObject.getFullYear();
            if (curMonth < 6) curYear--;
            return curYear + "-" + ((curYear + 1) % 100);
        }));
        const uniqueYears = [...setYears];
        if (!uniqueYears || uniqueYears.length === 0) {
            return res.status(200).json({ years: [], message: "No years found" });
        }

        res.status(200).json({ years: uniqueYears });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving years", error: error.message });
    }
};

module.exports = {
    getAllEvents,
    getEventsByYear,
    getUniqueYears
};