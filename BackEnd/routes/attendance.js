const express = require('express');
const router = express.Router();
const {markAttendanceIn, markAttendanceOut, getMonthAttendance, getSpecificDayAttendance} = require("../controllers/attendance");

router.route("/:uId")
    .post(markAttendanceIn)
    .patch(markAttendanceOut);

router.get("/oneDay/:date/:uId", getSpecificDayAttendance);

router.get("/:date/:uId", getMonthAttendance);

module.exports = router;