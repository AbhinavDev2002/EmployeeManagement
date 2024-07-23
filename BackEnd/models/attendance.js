const mongoose = require('mongoose');

// Define the attendance schema
const attendanceSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    start_time : {
        type : Date,
        required : true
    },
    end_time : {
        type : Date
    },
    hoursWorked: { 
        type: Number
    },
    status: { 
        type: String, 
        enum: ['Present', 'Absent', 'Leave', 'Half_Day']
    }
});

// Create an index to ensure a user can have only one record per date
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;


