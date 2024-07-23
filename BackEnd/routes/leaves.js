const express = require('express');
const router = express.Router();
const {createLeave, showLeavesbyId, editLeavesById, deleteLeaveById} = require("../controllers/leaves");

router.post("/",createLeave);
router.route("/:uId")
    .get(showLeavesbyId)
    .patch(editLeavesById)
    .delete(deleteLeaveById)

module.exports = router;