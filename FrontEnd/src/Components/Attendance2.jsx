import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import "../Style/Attendance.css"; // Custom CSS for styling
import Button from 'react-bootstrap/esm/Button';

function Attendance() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState([]);
    const [markedIn, setMarkedIn] = useState(false);
    const [markedOut, setMarkedOut] = useState(false);
    const [todayAttendance, setTodayAttendance] = useState(false);

    const fetchAttendance = async (year, month) => {
        try {
            const userId =  userDetails.uId; 
            const now = new Date();
            let formattedDate;

            // Check if the selected month is the current month or future
            if (year === now.getFullYear() && month >= now.getMonth()) {
                formattedDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
            } else {
                // For past months, use the last day of the selected month
                const lastDay = new Date(year, month + 1, 0);
                formattedDate = `${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`;
            }

            // Send the formatted date as a parameter in the GET request
            const response = await axios.get(`http://localhost:8000/attendance/${formattedDate}/${userId}`);

            // Store the fetched attendance data in state
            setAttendanceData(response.data.attendance);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching attendance:', error);
            setLoading(false);
        }
    };

    // const fetchUserDetails = () => {
    //     const user = JSON.parse(localStorage.getItem('userDetails'));
    //     if (user) {
    //         setUserDetails(user);
    //     }//
    // } /

    const getTodayAttendance = async ( ) =>{
        try{
            debugger;
            const userId =  userDetails.uId; 
            const now = new Date();
            let formattedDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
            const response = await axios.get(`http://localhost:8000/attendance/oneDay/${formattedDate}/${userId}`);
            if(response.status === 200){
                setTodayAttendance(true);
            }
        }
        catch (error) {
            console.error("Today's attendance not found");
        }
    }

    useEffect(() => {  
        const user = JSON.parse(localStorage.getItem('userDetails'));
        if (user) {
            setUserDetails(user);
        }   
    }, []);

    useEffect(() => {
        const now = new Date();
        fetchAttendance(now.getFullYear(), now.getMonth());
        getTodayAttendance();
    }, []);

    const handleActiveStartDateChange = ({ activeStartDate }) => {
        fetchAttendance(activeStartDate.getFullYear(), activeStartDate.getMonth());
    };

    const getTileClassName = ({ date, view }) => {
        if (view === 'month') {
            const attendance = attendanceData.find(att => {
                const attDate = new Date(att.date);
                return attDate.getDate() === date.getDate() &&
                    attDate.getMonth() === date.getMonth() &&
                    attDate.getFullYear() === date.getFullYear();
            });

            if (attendance) {
                return `attendance-tile ${attendance.status.toLowerCase().replace('_', '-')}`;
            }
            return 'attendance-tile not-found';
        }
    };

    const getTileContent = ({ date, view }) => {
        if (view === 'month') {
            const attendance = attendanceData.find(att => {
                const attDate = new Date(att.date);
                return attDate.getDate() === date.getDate() &&
                    attDate.getMonth() === date.getMonth() &&
                    attDate.getFullYear() === date.getFullYear();
            });

            if (attendance) {
                return <p>{attendance.hoursWorked} hrs</p>;
            }
        }
        return null;
    };

    // Functions for marking attendance
    const handleMarkIn = async () => {
        try {
            const userId =  userDetails.uId; 
            const response = await axios.post(`http://localhost:8000/attendance/${userId}`);
            setMarkedIn(true);
            console.log(response.data);
            fetchAttendance();
        } catch (error) {
            console.error('Error marking in:', error);
        }
    };

    const handleMarkOut = async () => {
        try {
            const userId =  userDetails.uId; 
            const response = await axios.patch(`http://localhost:8000/attendance/${userId}`);
            console.log(response.data);
            setMarkedOut(true);
            fetchAttendance();
        } catch (error) {
            console.error('Error marking out:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="attendance">
            <h1>Attendance</h1>
            <Calendar
                tileClassName={getTileClassName}
                tileContent={getTileContent}
                onActiveStartDateChange={handleActiveStartDateChange}
            />

            <Button onClick={handleMarkIn} disabled={todayAttendance}>Mark In</Button>
            <Button onClick={handleMarkOut} disabled={!todayAttendance}>Mark Out</Button>
        </div>
    );
}

export default Attendance;
