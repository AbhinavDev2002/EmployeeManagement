const express = require('express');
const router = express.Router();
const {handleAllUsers, getUserById, deleteUserById, createNewUser, sendUsers, updateUserById, handleUserfromRequest, handleUserLogin, handleUserSignUp, userImageUpload, getUserImage, updateReporting,handleuserInfoAfterLogin, getUserNoticeById, getUserDetailsById} = require('../controllers/user')
// The function which are performing tasks after .get or .post .. are called controllers
// We shall now make another file to save them in controllers
const multer = require('multer');
// const upload = multer({dest : "uploads/"}); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      cb(null, uniqueSuffix + file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

router.route("/")
    .get(handleAllUsers)
    .post(createNewUser)

router.post('/signup',handleUserSignUp)

router.post('/login', handleUserLogin)
  
router.get('/login/:email',handleuserInfoAfterLogin)
router.route('/uploadprofile/:uId')
    .patch(upload.single("file") ,userImageUpload)
    .get(getUserImage)

router.route("/all")
    .get(sendUsers)

router.patch('/reporting', updateReporting)

router.route('/request')
    .patch(handleUserfromRequest)
    .post(createNewUser)
// Now here we could also use the functionality of app.route

router.get("/details/:uId", getUserDetailsById);

router.route("/:uId")
    .get(getUserById)
    .patch(updateUserById)
    .delete(deleteUserById);
router.get("/notice/:uId",getUserNoticeById)

module.exports = router;
