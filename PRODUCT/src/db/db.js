const mongoose = require('mongoose')

const connectDB = ()=>{
    try{
        mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected");
    }
    catch(err){
        console.log("DB connection failed" , err);
    }
}

module.exports = connectDB;