const attendance = require("../models/attendance");
const User = require("../models/user");

async function markAttendanceIn(req, res){
    const userId = req.params.uId;
    if(!userId){
        return res.status(409).send("All Fields are requried");
    }
    const startTime = new Date();
    const currentDate = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());  
    try{
        const result = await attendance.create({
            userId : userId,
            start_time : startTime,
            end_time : startTime,
            date : currentDate,
            hoursWorked : 0,
            status : "Present"
        })
        console.log("Result : \n", result);
        return res.status(201).json({msg : "Success"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ 'message': "An error occurred" });
    }   
}

async function markAttendanceOut(req, res){
    const userId = req.params.uId;
    if(!userId){
        return res.status(409).send("All Fields are requried");
    }
    try{
        const endTime = new Date();
        const currentDate = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate());  
        const attend = await attendance.findOne({userId : userId}, {date : currentDate});
        if(!attend || attend.length == 0){
            return res.status(404).json({'message' : "User Attendance not found"});
        }
        const parsedDate1 = new Date(attend.start_time);
        const parsedDate2 = new Date(endTime);
        const differenceInMilliseconds = parsedDate2 - parsedDate1;
        const hours = differenceInMilliseconds / (1000 * 60 * 60); 
        let stats = ""; 
        if(hours <= 6){
            stats = "Half_Day";
        }
        else{
            stats = "Present";
        }
        const filter = userId;
        const update = {$set : {end_time :endTime, hoursWorked : hours, status : stats }};
        const result = await attendance.updateOne(filter, update);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ 'message': "User Attendance not found or data not modified" });
        }
        res.status(200).json({ 'message': "User Attendance updated successfully" });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ 'message': "An error occurred while updating the user attendance" });
    }
}

async function monthAttendance (userId, date){
    const dateObj = new Date(date);
    const firstDayOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    const currentDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    let attendanceRecords = [];
    
    while (currentDate >= firstDayOfMonth) {
        const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 999);
        
        // Here we are putting that the date should be in between the starting point of the day and the ending point of the day 
        // Such that only the specific  date could be considered and not the time
        const attendy = await attendance.findOne({
            userId: userId,
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        if (attendy) {
            attendanceRecords.push(attendy);
            // Move to the previous day now
            currentDate.setDate(currentDate.getDate() - 1);
        } 
        else {
            break;
        }
    }

    return attendanceRecords;
}

async function getMonthAttendance(req, res){
    const userId = req.params.uId;
    const date = req.params.date;
    if(!userId){
        return res.status(409).send("UserId not there");
    }
    try{
        const attendanceRecords = await monthAttendance(userId, date);
        return res.status(200).json({attendance: attendanceRecords })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ 'message': "An error occurred while finding the user attendance" });
    }
}

async function getSpecificDayAttendance(req, res){
    const userId = req.params.uId;
    const currentDate = req.params.date;
    const dateObj = new Date(currentDate);

    if(!userId){
        return res.status(409).send("UserId not there");
    }
    try{
        const startOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23, 59, 59, 999);
        const attendy = await attendance.findOne({
            userId: userId,
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });
        if(!attendy || attendy.length == 0){
            return res.status(404).json({message : "Attendance not found"});
        }
        return res.status(200).json({attendance: attendy });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ 'message': "An error occurred while finding the user attendance" });
    }
}


module.exports = {
    markAttendanceIn,
    markAttendanceOut,
    getMonthAttendance,
    getSpecificDayAttendance
}


