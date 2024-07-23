const userAuth = require('../models/auth');
const {getUser, setUser} = require('../service/auth');
const bcrypt = require('bcrypt')

async function handleUserSignUp(req, res){

    const body = req.body;
    if(!body || !body.firstName || !body.email || !body.password){
        return res.status(400).json("FirstName, Email and Password are required");
    }

    const oldUser = await userAuth.findOne({ email: body.email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const salt = await bcrypt.genSalt(12);
    const pass = body.password;

    body.password = await bcrypt.hash(pass, salt);
    const count = await userAuth.countDocuments({})
    const result = await userAuth.create({
        UserId : count + 1,
        FirstName : body.firstName,
        LastName : body.lastName, 
        email : body.email,
        password : body.password
    });
    console.log("Result : \n", result);
    return res.status(201).json({msg : "Success"});
}


async function handleUserLogin(req, res){
    try{
        const body = req.body;
        const user = await userAuth.findOne({
            email : body.email,
        });
        if(!user){
            return res.status(404).json({message : "Invalid email"});
        }

        if (!(await bcrypt.compare(body.password, user.password))) {
            return res.status(404).json({ message: "Invalid password" });
        }
        const token = setUser(user);
        res.cookie("token", token, {
            httpOnly: true, 
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({token});
    }
    catch(error){
        console.error(error);
        return res.status(500).json("Internal Sever Error")
    }
}

async function handleUserLoginbyCookie(req, res){
    try{
        const body = req.body;
        const user = await userAuth.findOne({
            email : body.email,
            password : body.password
        });
        if(!user){
            return res.status(400).json("Invalid email or password")
        }
        const token = setUser(user);
        res.cookie("uid", user)
        return res.setHeader({token});
    }
    catch(error){
        console.error(error);
        return res.status(500).json("Internal Sever Error")
    }
}

module.exports = {
    handleUserSignUp,
    handleUserLogin
}