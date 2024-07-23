const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    UserId :{
        type : Number,
        required : true
    },
    FirstName : {
        type : String,
        required : true
    },
    LastName : {
        type : String
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : [true, "Please enter a valid password"],
        minLength : [6, "Minimum password length should be 6 characters"]
    },
},
    {timestamps : true}
);



const userAuth = mongoose.model("credentials", userSchema);

module.exports = userAuth;