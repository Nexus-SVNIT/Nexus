const express = require("express");
const router = express.Router();
const axios = require("axios");
const Contest = require("../models/contestModel");
const CodingProfile = require("../models/codingProfileModel");

const CODING_PROFILE_API = process.env.CODING_PROFILE_BASE_URL;

// Route for creating an issue
router.get("/user/:platform/:id", async (req, res) => {
    const contest = await Contest.findOne({},{time: 1, data: -1, _id:-1});
    if(contest && contest.time){
        const currentTime = new Date();
        if(currentTime - contest.time < 1000 * 60 * 60 * 24){
            const user = await CodingProfile.findOne({userId: req.params.id},{platform: 1, _id: 0});
            if(user && user.data){
                res.json(user.data);
            } else {
                const data = await axios.get(`${CODING_PROFILE_API}/user/${req.params.platform}/${req.params.id}`);
                await CodingProfile.create({[req.params.platform]: data.data, userId: req.params.id, data: data.data});
                res.json(data.data);
            }
        } else {
            const data = await axios.get(`${CODING_PROFILE_API}/user/${req.params.platform}/${req.params.id}`);
                await CodingProfile.create({[req.params.platform]: data.data, userId: req.params.id, data: data.data});
                res.json(data.data);
        }
    } else {
        const newData = await axios.get(`${CODING_PROFILE_API}/contests/upcoming`);
        await Contest.create({data: newData.data, time: new Date()});
        res.json(newData.data);
    }
});

router.get("/contests/upcoming", async (req, res) => {
    // const data = await axios.get(`${CODING_PROFILE_API}/contests/upcoming`);
    const data = await Contest.findOne({});

    if(data && data.time){
        const currentTime = new Date();
        if(currentTime - data.time < 1000 * 60 * 60 * 24){
            res.json(data.data);
        } else {
            const newData = await axios.get(`${CODING_PROFILE_API}/contests/upcoming`);
            await Contest.findOneAndUpdate({}, {data: newData.data, time: new Date()});
            res.json(newData.data);
        }
    } else {
        const newData = await axios.get(`${CODING_PROFILE_API}/contests/upcoming`);
        await Contest.create({data: newData.data, time: new Date()});
        res.json(newData.data);
    }

});


module.exports = router;
