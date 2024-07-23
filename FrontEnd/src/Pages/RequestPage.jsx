import { useEffect, useState } from "react";
import React from "react";
import axios from 'axios'
import RequestAuth from "../Components/requestAuth";
import '../Style/userTable.css'
import { useNavigate } from 'react-router-dom';

function RequestPage(){

    const [isFetched, setIsFetched] = useState(false);
    const [users, setUser] = useState([]);
    const [formData, setFormData] = useState({
        firstName : '',
        lastName : '',
        email : '',
        gender : 'Male'
    });

    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () =>{
        try{
            const response = await axios.get('http://localhost:8000/request/all');
            setIsFetched(true);
            setUser(response.data);
        }
        catch(error){
            console.log("error fetching data", error);
            navigate('/login');
        }
    }

    useEffect(() =>{
        fetchData();
    }, []);

    const handleRequest = (user) =>{
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            gender: user.gender,
        });
        setShowForm(true);
    }

    return (
        <div className="app">
            <h1 className="title">Pending Requests</h1>
            <div className="table-container">
                {isFetched && (
                    <table className="user-table">
                        <thead className="table-header">
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Check Request</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.email}>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.gender}</td>
                                    <td>
                                        <button onClick={() => handleRequest(user)} className="action-button">Check Request</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {showForm && <RequestAuth userData={formData} />}
        </div>
    );
}

export default RequestPage;
