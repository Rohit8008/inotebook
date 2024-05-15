const mongoose = require('mongoose');
require("dotenv").config();

const mongoURL = process.env.MONGOURL || "mongodb://localhost:27017/inotebook";

const connectToMongo = ()=>{
    mongoose.connect(mongoURL)
    .then(()=>{
        console.log("Connection Succesfull");
    })
    .catch(err=>{
        console.log("Connection failed");
    })
}

module.exports = connectToMongo;