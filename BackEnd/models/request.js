const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName :{
        type : String
    },
    email:{
        type : String,
        required : true,
        unique : true
    },
    gender:{
        type : String
    }
})

const requestDb = mongoose.model("request", schema);

module.exports = requestDb;