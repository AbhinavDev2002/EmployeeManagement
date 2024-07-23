const leave  = require("../models/leaves");
const User = require("../models/user");

async function createLeave(req, res){
    const body = req.body;
    if(!body || !body.userId || !body.startDate || !body.endDate){
        return res.status(409).send("All Fields are requried");
    }
    try{
        const result = await leave.create({
            userId : body.userId,
            startDate : body.startDate,
            endDate : body.endDate,
            reason : body.reason
        })
        console.log("Result : \n", result);
        return res.status(201).json({msg : "Success"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ 'message': "An error occurred" });
    }
}

async function showLeavesbyId(req, res){
    const uId = req.params.uId;
    try{
        const userLeaves = await leave.find({userId: uId}).exec();
        if(!userLeaves || userLeaves.length === 0){
            return res.status(404).json({'message' : "User Leaves not found"});
        }
        const userLeavesWithUid = userLeaves.map(leave => ({ ...leave.toObject(), userId: uId }));
        return res.status(200).json(userLeavesWithUid);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ 'message': "An error occurred while fetching user leaves" });
    }
}

async function editLeavesById(req, res){
    const body = req.body;
    if(!body || !body.userId || !body.startDate || !body.endDate){
        return res.status(409).send("All Fields are requried");
    }

    const userLeaves = leave.findOne({userId: body.userId});
    if(!userLeaves || userLeaves.length === 0){
        return res.status(404).json({'message' : "User Leaves not found"});
    }

    const filter = body.userId;
    const update = {$set : {startDate : body.startDate, endDate : body.endDate, reason : body.reason}}

    try {
        const result = await User.updateOne(filter, update);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ 'message': "User Leaves not found or data not modified" });
        }
        res.status(200).json({ 'message': "User Leaves updated successfully" });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ 'message': "An error occurred while updating the user leaves" });
    }
}

async function deleteLeaveById(req, res){}

module.exports = {
    createLeave,
    showLeavesbyId,
    editLeavesById,
    deleteLeaveById
}