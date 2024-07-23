const requestDb = require('../models/request')

async function sendRequest(req,res){
    try {
        const dbRequest = await requestDb.find(); // Fetch all users from the database
        res.status(200).json(dbRequest); // Send the list of users as JSON
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function submitRequest (req, res){
    try{
        const body = req.body;
        if(!body || !body.firstName || !body.email || !body.gender){
            return res.status(400).json({msg : "All fields are requried ..."});
        }
        const result = await requestDb.create({
            firstName : body.firstName,
            lastName : body.lastName,
            email : body.email,
            gender : body.gender
        })
        console.log("Result : \n", result);
        return res.status(201).json({msg : "Success"});
    }
    catch{
        console.error('Error creating requests', error);
        res.status(500).json({ message: 'Server error' });   
    }
}

async function deleteRequest(req, res){
    const email = req.params.email;
    requestDb.deleteOne({email : email})
    .then(result =>{
        if(result.deletedCount >= 1){
            return res.status(200).json({message : `UserId with email ${email} deleted successfuly`})
        }
        else{
            return res.status(404).json({'message' : "User not found"});
        }
    })
    .catch(err =>{
        console.error("Error deleting documents:", err);
    })
}

module.exports = {
    sendRequest,
    submitRequest,
    deleteRequest
}