require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ExpressError=require("./utils/ExpressError.js");
const path=require("path");
const ejsMate=require("ejs-mate");
const methodOverrride=require("method-override");
const eventRoutes = require('./routes/eventRoutes.js');
const memberRoutes=require('./routes/memberRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');

const app = express();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs",ejsMate);

app.use(methodOverrride("_method"));
app.use(express.urlencoded({extended:true}));// I have use this to send req from hoppscotch
app.use(express.static(path.join(__dirname,"/public")));

app.use(express.json());
app.get('/', (req, res) => {
    res.send("Welcome to the official website of Nexus")
});
app.use('/event', eventRoutes);
app.use('/member',memberRoutes);
app.use('/messages', messageRoutes);

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

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
    }); 

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).send(err.message); 
    // next(err);
    
});