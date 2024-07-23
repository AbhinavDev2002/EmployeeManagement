const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function setUser(user){
    const payload = {
        id : user._id,
        email : user.email,
    }
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
}

function getUser(token){
    if(!token){
        return null;
    }
    try{
        const authHeaders = req.headers['authorization'];
        const token = authHeaders && authHeaders.split(' ')[1];
        return(jwt.verify(token, process.env.ACCESS_TOKEN_SECRET));  
    }
    catch{
        return null;
    }
}

async function authenticateToken(req, res, next){
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(' ')[1];
    if(!token){
        return res.sendStatus(401);
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        if(err){
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    })

}

module.exports = {
    setUser,
    getUser,
    authenticateToken 
}