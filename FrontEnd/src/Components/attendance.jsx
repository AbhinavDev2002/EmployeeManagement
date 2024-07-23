import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import './Attendance.css'; // Create and import your custom CSS

const Attend = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState([]);

    useEffect(() => {
        const fetchUserDetails = () => {
            const user = JSON.parse(localStorage.getItem('userDetails'));
            if (user) {
                setUserDetails(user);
            }
        }
        const fetchAttendance = async () => {
            try {
                const userId = userDetails.userId; // Replace with actual user ID
                const now = new Date();
                // Format the date to YYYY-MM-DD to match backend expectations
                const formattedDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
                const response = await axios.get(`http://localhost:8000/attendance/${formattedDate}/${userId}`);
                setAttendanceData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching attendance:', error);
                setLoading(false);
            }
        };
        
        fetchUserDetails();
        fetchAttendance();
    }, []);

    const getTileClassName = ({ date, view }) => {
        if (view === 'month') {
            const attendance = attendanceData.find(att => {
                const attDate = new Date(att.date);
                return attDate.getDate() === date.getDate() &&
                       attDate.getMonth() === date.getMonth() &&
                       attDate.getFullYear() === date.getFullYear();
            });

            if (attendance) {
                return `attendance-tile ${attendance.status.toLowerCase()}`;
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Attendance</h1>
            <Calendar
                tileClassName={getTileClassName}
                tileContent={getTileContent}
            />
        </div>
    );
};

export default Attend;
