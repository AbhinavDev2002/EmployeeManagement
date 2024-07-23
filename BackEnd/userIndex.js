const express = require('express');
const port = 8000;
const app = express();
const cookieParser = require('cookie-parser');
const userRouter = require("./routes/user");
const userAuthRouter = require("./routes/userAuth");
const requestRouter = require('./routes/request');
const noticeRouter = require('./routes/notice')
const leaveRouter = require("./routes/leaves")
const attendanceRouter = require("./routes/attendance")

const {connectMongoDB} = require('./connection');
const {logReqRes} = require('./middleware/index');
const cors = require('cors');
const { restrictToLoggedinUserOnly} = require('./middleware/auth');
// Connecting with mongoose

connectMongoDB('mongodb://127.0.0.1:27017/bioData')

// Here we are applying a middleware
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({extended : false})); // This middleware is used to put the data into the body
// This above middleware is used to parse the form data in the body
app.use(cors());
// add to config
app.use(logReqRes("log.txt"));

// move to middlewares
// Using my routes here:
app.use("/user",userRouter);
app.use("/auth",userAuthRouter);
app.use("/request", requestRouter);
app.use("/notice", noticeRouter);
app.use("/leave", leaveRouter);
app.use("/attendance", attendanceRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));  