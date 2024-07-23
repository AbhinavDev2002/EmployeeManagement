const mongoose = require('mongoose');

const noticeLikes = new mongoose.Schema({
    noticeId : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true
    },
    liked : {
        type : Boolean
    },
    deleted : {
        type : Boolean
    }
})

const notice_Likes = mongoose.model("noticeLikes", noticeLikes);

module.exports = notice_Likes;