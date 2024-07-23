const mongoose = require('mongoose');
// check if joi is better than mongoose

/// Making schema for mongodb

const attendanceSchema = new mongoose.Schema({
    date: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }, { _id: false }); 

const userSchema = new mongoose.Schema({
    userId :{
        type : Number,
        required : true,
        unique : true
    },
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
    password : {
        type : String,
        required : [true, "Please enter a valid password"],
        minLength : [6, "Minimum password length should be 6 characters"]
    },
    gender:{
        type : String
    },
    jobTitle : {
        type : String
    },
    department :{
        type : String
    },
    attendance : [attendanceSchema], // This will have a nested schema
    leaves : {
        type : Number
    },
    performanceReview :{
        type : [String]
    },
    sallary :{
        type : Number
    },
    role : {
        type : String,
        enum : ['User', 'Admin', 'HR', 'Super_Admin']
    }, 
    profileImage : {
        type : String
    },
    managerEmail : {
        type : String
    },
    reportingEmail : {
        type : [String]
    }

},{timestamps : true});

const User = mongoose.model("user", userSchema);

module.exports = User;