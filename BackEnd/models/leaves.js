const mongoose = require('mongoose');

// This Schema is for making the request for leaves

const leaves = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    startDate : {
        type : Date,
        required : true
    },
    endDate : {
        type : Date,
        required : true
    },
    reason : {
        type : String
    }
})

const leave = mongoose.model("leaves", leaves);

module.exports = leave;