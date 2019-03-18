const config = require('./config');
const mongoose = require('mongoose');
mongoose.connect(config.MONGO_URI, { useNewUrlParser:true } , ()=>{
    console.log("mongodb connected!");
})