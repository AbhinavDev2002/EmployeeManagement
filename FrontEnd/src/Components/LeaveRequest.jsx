import React, { useEffect, useState, useContext, createContext } from "react";
import SideBar from "../Components/SideBar";
// import '../Style/Profile.css'
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Table from 'react-bootstrap/Table';

function Leaves(){
    // const UserContext = createContext();
    // const user = useContext(UserContext);
    const [isReporting, setIsReporting] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state
    const [submitted, setSubmitted] = useState(false);
    const [userDetails, setUserDetails] = useState();
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

    const showLeaveRequest = async(e) =>{
        e.preventDefault();
        const myLeaves = await axios.get(`http://localhost:8000/leaves/${userDetails.userId}`);
        setUserLeaves(myLeaves.data);
        setShowLeaves(true);
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
        } catch (error) {
            console.error('Error fetching leaves:', error);
        }

    }

    const handleLeaveSubmit = async (e) =>{
        e.preventDefault();
        if(!startDate || !endDate){
            alert(`Date is not entered please enter them`);
            return;
        }
        const data = {
            userId : userDetails.userID,
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
            <button type='submit' onClick={setApplyLeave(true)} className='form-button'>Apply Leave</button>

            {applyLeave && <div className='container'>
                <div className='form-container'>
                    <h2 className='form-title'>Employee Leave Request Form</h2>
                    <form className='form'>
                        <DatePicker  selected={startDate} placeholderText="Select Start Date" onChange={(date) => setStartDate(date)} />
                        <DatePicker selected={endDate} placeholderText="Select End Date" onChange={(date) => setEndDate(date)} />
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
            
            
        </div>
    )
}

export default Leaves;