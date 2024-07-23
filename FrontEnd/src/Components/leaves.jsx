import React, { useEffect, useState, useContext, createContext } from "react";
import SideBar from "../Components/SideBar";

import { Popconfirm, Button } from "antd";
// import '../Style/Profile.css'
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Table from 'react-bootstrap/Table';

//7 numbers specify year, month, day, hour, minute, second, and millisecond (in that order):

function Leaves(){
    // const UserContext = createContext();
    // const user = useContext(UserContext);
    const [isReporting, setIsReporting] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state
    const [submitted, setSubmitted] = useState(false);
    const [userDetails, setUserDetails] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [reason, setReason] = useState('');

    const [userLeave, setUserLeaves] = useState([]);
    const[applyLeave, setApplyLeave] = useState(false);
    const[showLeaves, setShowLeaves] = useState(false);

    const [reportingLeaves, setReportingLeaves] = useState([]);
    const[showReportingLeaves, setShowReportingLeaves] = useState(false);


    const handleReasonChange = (e) =>{
        const {value} = e.target;
        setReason(value);
    }

    const setToMidnight = (date) => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
    };

    const setToEndOfDay = (date) => {
        const newDate = new Date(date);
        newDate.setHours(23, 59, 0, 0);
        return newDate;
    };
    

    const showLeaveRequest = async(e) =>{
        e.preventDefault();
        try{
            const myLeaves = await axios.get(`http://localhost:8000/leaves/${userDetails.userId}`);
            setUserLeaves(myLeaves.data);
            setShowLeaves(true);
        }
        catch(error){
            console.log(error);
        }
    }

    const showReportingRequest = async(e) =>{
        e.preventDefault();
        try {
            const leaveRequests =  userDetails.reportingEmail.map(userId => 
                 axios.get(`http://localhost:8000/leaves/${userId}`)
            );
            const leaveResponses = await Promise.all(leaveRequests);
            const leaves = leaveResponses.flatMap(response => response.data);

            const userRequests = userDetails.reportingEmail.map(userId => 
                axios.get(`http://localhost:8000/user/details/${userId}`) 
            );
            const userResponses = await Promise.all(userRequests);
            const users = userResponses.map(response => response.data);
            
            const leavesWithUserNames = leaves.map(leave => {
                const user = users.find(user => user.id === leave.userId);
                return {
                    ...leave,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    email : user.email
                };
            });

            setReportingLeaves(leavesWithUserNames);
            setShowReportingLeaves(true);
        } 
        catch (error) {
            console.error('Error fetching leaves:', error);
        }
    }

    const handleLeaveApprove = async(e) => {
        e.preventDefault();
    }

    const handleLeaveSubmit = async (e) =>{
        e.preventDefault();
        debugger;
        if(!startDate || !endDate){
            alert(`Date is not entered please enter them`);
            return;
        }
        if(endDate < startDate){
            alert("Please input the endDate after StartDate");
            return;
        }
        const data = {
            userId : userDetails.uId,
            startDate : startDate,
            endDate : endDate,
            reason : reason
        }
        try{
            setSubmitted(true);
            const response = await axios.post("http://localhost:8000/leave/", data);
            if(response.status === 201){
                alert("Leave request made!")
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userDetails'));
    if (user) {
        debugger;
        setUserDetails(user);
        setLoading(false);
    }
    if(user.reportingEmail && user.reportingEmail.length > 0){
        setIsReporting(true);
    }
    }, []);


    if (loading) {
        return <div>Loading...</div>; // Display a loading message while fetching data
    }

    return(
        <div>
            <SideBar/>
            <div className="">
                <div className="">
                    <h1>Leaves</h1>
                    <h4> Number of remaining leaves : {userDetails.leaves}</h4>
                </div>
            </div>
            <button type='submit' onClick={() =>setApplyLeave(true)} className='form-button'>Apply Leave</button>

            {applyLeave && <div className='container'>
                <div className='form-container'>
                    <h2 className='form-title'>Employee Leave Request Form</h2>
                    <form className='form'>
                        <label> Enter Start Date </label>
                        <DatePicker  selected={startDate} placeholderText="Select Start Date" onChange={(date) => setStartDate(setToMidnight(date))} />
                        <label> Enter End Date </label>
                        <DatePicker selected={endDate} placeholderText="Select End Date" onChange={(date) => setEndDate(setToEndOfDay(date))} />
                        <input name='reason' type='text' value= {reason} placeholder='Enter your reason for leave' onChange={handleReasonChange} className='form-input'  />
                        
                        <button type='submit' onClick={handleLeaveSubmit} className='form-button'>Submit Leave Request</button>
                    </form>

                    {submitted && (
                        <div className='result'>
                            <div>
                                <h2> Leave Applied, waiting for approval </h2>
                                {/* <p>First Name: {loginData.firstName}</p> */}
                                <p>Start Date: {startDate}</p>
                                <p>End Date: {endDate}</p>
                                <p>Reason: {reason}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>}
            <button type="submit" onClick={showLeaveRequest} className="action-button">Show Leaves Request</button>
            {showLeaves && (
                <Table striped bordered hover>
                    <thead >
                        <tr>
                            <th>S.No</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportingLeaves.map((leave, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{leave.startDate}</td>
                                <td>{leave.endDate}</td>
                                <td>{leave.reason}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {isReporting && <div>
                <button type="submit" onClick={showReportingRequest} className="action-button">Show Reporting Leaves Request</button>
                {showReportingLeaves && (
                <Table striped bordered hover>
                    <thead >
                        <tr>
                            <th>S.No</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Reason</th>
                            <th>Approve</th>
                            <th>Deny Approve</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userLeave.map((leave, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{leave.firstName}</td>
                                <td>{leave.lastName}</td>
                                <td>{leave.email}</td>
                                <td>{leave.startDate}</td>
                                <td>{leave.endDate}</td>
                                <td>{leave.reason}</td>
                                <td>
                                    <Popconfirm
                                        title="Disapprove the Leave" description="Are you sure you want to disapprove the Leave" >
                                        <button className="action-button">❎</button>

                                    </Popconfirm>
                                </td>
                                <td>
                                    <Popconfirm
                                        title="Approve the Leave" description="Are you sure you want to Approve this Leave" >
                                        <button  className="action-button">✅</button>
                                    </Popconfirm>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            </div>}
            
        </div>
    )
}

export default Leaves;