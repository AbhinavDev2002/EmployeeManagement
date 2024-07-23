const express = require('express');
const { route } = require('./user');
const router = express.Router();
// const {handleUserSignUp, handleUserLogin} = require('../controllers/auth');
const {handleUserLogin, handleUserSignUp} = require('../controllers/user')


router.post('/signup',handleUserSignUp)
router.post('/login',handleUserLogin)
router.get('/logout',(req,res) =>{
    res.clearCookie("token");
    res.json("Logged out!!");
});

module.exports = router;