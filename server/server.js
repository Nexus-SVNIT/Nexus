require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.get('/', (req, res) => {
    res.send("Welcome to the official website of Nexus")
})

mongoose.connect(MONGO_URL)
    .then(() => {
        app.listen(PORT, (req, res)=>{
            console.log('connected to db');
            console.log('listening on port', PORT);
        })
    })
    .catch((err) => {
        console.log(err)
    });