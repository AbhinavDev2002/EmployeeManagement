
const User = require("../models/user");
const bcrypt = require('bcrypt');

// import {setUser} from '../service/auth'

async function handleAllUsers(req, res) {
    try{
        const dbUsers = await User.find({}); // This command fetched 
        const userData = dbUsers.map((user) => ({
            firstName: user.firstName,
            email: user.email,
            id : user._id
        }));
        return res.status(200).json(userData);
    }
    catch(error){
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getUserNoticeById(req, res){
    const uId = req.params.uId;
    try{
        const user = await User.findOne({ _id: uId });
            
        if(!user || user.length === 0){
            return res.status(404).json({'message' : "User not found"});
        }
        const data = {firstName : user.firstName, department : user.department, jobTitle : user.jobTitle}
        return res.status(200).json(data);
    }
    catch(error){
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


async function getUserById(req, res) {
    const uId = req.params.uId;
    const user = await User.findOne({ userId: uId });
        
    if(!user || user.length === 0){
        return res.status(404).json({'message' : "User not found"});
    }
    // res.setHeader("X-name", user.firstName);
    return res.status(200).json(user);
};

async function getUserDetailsById(req, res) {
    const uId = req.params.uId;
    const user = await User.findOne({ userId: uId });
        
    if(!user || user.length === 0){
        return res.status(404).json({'message' : "User not found"});
    }
    // res.setHeader("X-name", user.firstName);
    const userData = {firstName : user.firstName, lastName : user.lastName, email : user.email}
    return res.status(200).json(userData);
};


async function updateUserById(req, res) {
    const filter = {userId : req.params.uId};
    const body = req.body;

    if(!body || !filter){
        return res.status(404).json({'message' : "User not found"});
    }
    const fName = body.firstName, lName = body.lastName, mail = body.email, gend = body.gender, job = body.jobTitle;
    const update = {$set : {firstName : fName, lastName : lName, email : mail, gender : gend, jobTitle : job}};

    try {
        const result = await User.updateOne(filter, update);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ 'message': "User not found or data not modified" });
        }
        res.status(200).json({ 'message': "User updated successfully" });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ 'message': "An error occurred while updating the user" });
    }
};


async function sendUsers(req,res){
    try {
        const dbUsers = await User.find(); // Fetch all users from the database
        res.status(200).json(dbUsers); // Send the list of users as JSON
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

async function userImageUpload(req, res){
    try{
        const imageName = req.file.filename;
        console.log(req.file.filename);
        const update = {$set : {profileImage : imageName}}
        const filter = {userId : req.params.uId};
        
        try{
            const result = await User.updateOne(filter, update);
            if (result.modifiedCount === 0) {
                return res.status(404).json({ 'message': "User not found or image not uploaded" });
            }
            res.status(200).json({ message: "User Image Uploaded successfully" });
        }
        catch(err){
            console.log(err);
            res.status(500).json({ 'message': "An error occurred while updating the user" });
        }
    }
    catch(error){
        console.log(error);
    }
}

async function getUserImage(req, res){
    const uId = req.params.uId;
    const userImage = await User.find({ userId: uId },{profileImage : 1});
        
    if(!userImage || userImage.length == 0){
        return res.status(404).json({'message' : "User not found"});
    }
    return res.status(200).json(userImage);
}

async function deleteUserById(req, res){
    const uId = req.params.uId;
    User.deleteOne({userId : uId})
    .then(result =>{
        if(result.deletedCount >= 1){
            return res.status(200).json({message : `UserId ${uId} deleted successfuly`})
        }
        else{
            return res.status(404).json({'message' : "User not found"});
        }
    })
    .catch(err =>{
        console.error("Error deleting documents:", err);
    })
};

async function handleUserSignUp(req, res){

    const body = req.body;
    if(!body || !body.firstName || !body.email || !body.password){
        return res.status(400).json("FirstName, Email and Password are required");
    }
    
    const oldUser = await User.findOne({ email: body.email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const salt = await bcrypt.genSalt(12);
    const pass = body.password;

    body.password = await bcrypt.hash(pass, salt);
    const count = await User.countDocuments({})
    const result = await User.create({
        userId : count + 1,
        firstName : body.firstName,
        lastName : body.lastName, 
        email : body.email,
        password : body.password
    });
    console.log("Result : \n", result);
    return res.status(201).json({msg : "Success"});
}

async function handleuserInfoAfterLogin(req, res){
    try{
        const email = req.params.email;
        const user = await User.findOne({
            email : email,
        });
        if(!user){
            return res.status(404).json("Invalid email");
        }
        const userDetails = {
            uId : user._id,
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
            gender : user.gender,
            jobTitle : user.jobTitle,
            department : user.department,
            attendance : user.attendance,
            leaves : user.leaves,
            performance : user.performanceReview,
            role : user.role,
            sallary : user.sallary,
            profileImage : user.profileImage,
            manager : user.managerEmail,
            Reporting : user.reportingEmail
        }
        return res.status(200).json(userDetails);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message : "Internal Server error"});

    }
}

async function handleUserLogin(req, res){
    try{
        const body = req.body;
        const user = await User.findOne({
            email : body.email,
        });
        if(!user){
            return res.status(404).json("Invalid email");
        }

        if (!(await bcrypt.compare(body.password, user.password))) {
            return res.status(404).json({ message: "Invalid password" });
        }

        // const token = setUser(user);
        // res.json({token : token});
        
        // res.cookie("token", token, {
        //     httpOnly: true, 
        //     maxAge: 24 * 60 * 60 * 1000
        // });
        // res.status(200).json({token});

        return res.status(200).json({message : "User Logged In"});
    }
    catch(error){
        console.error(error);
        return res.status(500).json("Internal Sever Error")
    }
}

async function updateReporting(req, res){
    try{
        const body = req.body;
        if(!body || !body.reportingEmail || !body.managerEmail){
            return res.status(400).json({msg : "All fields are requried ..."});
        }
        const user = await User.findOne({email :body.managerEmail});
        if(!user){
            return res.status(404).json("Invalid email");
        }
        if (!user.reportingEmail) {
            // Initialize the reportingEmail array if it does not exist
            const result = await User.updateOne(
                { email : body.managerEmail },
                { $set: { reportingEmail: [ body.reportingEmail] } }
            );
            if (result.modifiedCount === 0) {
                return res.status(404).json({ 'message': "User not found or data not modified" });
            }
        }
        else{
            const update = { $push: {reportEmail : body.reportingEmail } };
            const filter = {email : body.managerEmail}
            const result = await User.updateOne(filter, update);
            if (result.modifiedCount === 0) {
                return res.status(404).json({ 'message': "User not found or data not modified" });
            }
        }
        res.status(200).json({ 'message': "User updated successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ 'message': "An error occurred while updating the user" });
    }
}

async function createNewUser(req, res){
    const body = req.body;
    if(!body || !body.firstName || !body.email || !body.gender){
        return res.status(400).json({msg : "All fields are requried ..."});
    }
    const count = await User.countDocuments({})
    const result = await User.create({
        userId : count + 1,
        firstName : body.firstName,
        lastName : body.lastName,
        email : body.email,
        gender : body.gender,
        jobTitle : body.jobTitle,
        department : body.department,
        leaves : body.leaves,
        sallary : body.sallary,
        role : body.role
    });
    console.log("Result : \n", result);
    return res.status(201).json({msg : "Success"});
}


async function handleUserfromRequest(req, res){
    const body = req.body;
    if(!body || !body.firstName || !body.email || !body.gender){
        return res.status(400).json({msg : "All fields are requried ..."});
    }

    const oldUser = await User.findOne({ email: body.email });
    if (!oldUser) {
        await createNewUser(req, res);
        return;
    }
    const fName = body.firstName, lName = body.lastName, mail = body.email, gend = body.gender, job = body.jobTitle;
    const dep = body.department, leave = body.leaves, salary = body.sallary, rol = body.role, manager = body.manager;
    const update = {$set : {firstName : fName, lastName : lName, email : mail, gender : gend, jobTitle : job, department : dep, leaves : leave, sallary : salary, role : rol, managerEmail : manager}};
    
    const filter = {email : body.email}

    try {
        const result = await User.updateOne(filter, update);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ 'message': "User not found or data not modified" });
        }
        res.status(200).json({ 'message': "User updated successfully" });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ 'message': "An error occurred while updating the user" });
    }
}


module.exports = {
    handleAllUsers,
    getUserById,
    deleteUserById,
    createNewUser,
    sendUsers,
    updateUserById,
    handleUserfromRequest,
    handleUserSignUp,
    handleUserLogin,
    userImageUpload,
    getUserImage,
    updateReporting,
    handleuserInfoAfterLogin,
    getUserNoticeById,
    getUserDetailsById
}