require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const eventRoutes = require('./routes/eventRoutes.js');

const app = express();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());
app.get('/', (req, res) => {
    res.send("Welcome to the official website of Nexus")
});
app.use('/event', eventRoutes);

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