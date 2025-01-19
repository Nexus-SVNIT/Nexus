const Counter = require('../models/counterModal');

// Get visitor count
const getCount = async (req, res) => {
    try {
        const counter = await Counter.findOne();
        res.status(200).json(counter ? counter.count : 0);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Increment visitor count
const incrementCount = async (req, res) => {
    try {
        const counter = await Counter.findOne();
        if (!counter) {
            const newCounter = await Counter.create({ count: 1 });
            return res.status(200).json(newCounter.count);
        }
        
        counter.count += 1;
        await counter.save();
        res.status(200).json(counter.count);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCount,
    incrementCount
};
