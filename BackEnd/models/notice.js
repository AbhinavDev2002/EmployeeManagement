const mongoose = require('mongoose');

const noticeBoard = new mongoose.Schema({
    title :{
        type :  String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    attachements : {
        type : String
    },
    authorId : {
        type : String
    },
    category : {
        type : String
    },
    likes : {
        type : Number
    }

}, {timestamps : true});

const notice = mongoose.model("notice", noticeBoard);

module.exports = notice;