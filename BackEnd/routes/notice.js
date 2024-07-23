const express = require('express');
const router = express.Router();
const {handleAllNotice, handleLikeChange, createNewNotice, deleteNotice, updateNotice, hideNotice, showLikes} = require('../controllers/notice')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'notice_uploads/')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now()
//       cb(null, uniqueSuffix + file.originalname)
//     }
//   })
  
// const upload = multer({ storage: storage })

router.get("/:uId",handleAllNotice)

router.route("/")
    .post(createNewNotice)

router.delete("/:noticeId/:authorId",deleteNotice)

router.patch("/update", updateNotice)
router.get("/like/:noticeId", showLikes)
router.post("/update_like", handleLikeChange)
router.post("/hide", hideNotice)

module.exports = router;
