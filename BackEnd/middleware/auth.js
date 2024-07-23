const { getUser } = require("../service/auth");

async function restrictToLoggedinUserOnly(req, res, next) {
    const userUid = req.cookies?.token;
    // This ? means that first it will check for the presence of cookies and if there are cookies then it will check for uid

    if (!userUid){
        return res.status(400).json("User not registered ");
    }
    const user = getUser(userUid);
    if (!user){
        return res.status(400).json("User not logged in");
    }

    req.user = user;
    next();
}


async function verifyUserLogin(req, res, next){
  
  const { authorization } = req.headers
  const token = authorization.substring('Bearer '.length);
  console.log(token);
  if(!token){
    return res.status(401).json({error : "Access denied"});
  }
  try{
    const verified = getUser(token);
    if(verified){
      req.user = verified;
      next();
    }
    else{
      return res.status(400).json("Access denied");
    }
  }
  catch(error){
    return res.status(500).json("Access denied");
  }
}

async function checkAuth(req, res, next) {
    
  const userUid = req.cookies?.uid;
  const user = getUser(userUid);
  req.user = user;
  next();
}

module.exports = {
  restrictToLoggedinUserOnly,
  checkAuth,
  verifyUserLogin
};