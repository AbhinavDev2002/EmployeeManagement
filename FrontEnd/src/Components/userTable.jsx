import { useState } from "react";
import React from "react";
import axios from 'axios'
import EmployeeForm from "./form";
// import '../Style/userTable.css'
import 'bootstrap/dist/css/bootstrap.css'
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

function UserTable(){

    const [isFetched, setIsFetched] = useState(false);
    const [users, setUser] = useState([]);
    const [updateForm, setUpdateForm] = useState(false);
    const [deleteForm, setDeleteForm] = useState(false);
    const [formData, setFormData] = useState({
        userId : null,
        firstName : '',
        lastName : '',
        email : '',
        gender : 'Male',
        jobTitle : ''
    });

    const navigate = useNavigate();

    const fetchData = async () =>{
        try{
            const response = await axios.get('http://localhost:8000/user/all');
            setIsFetched(true);
            setUser(response.data);
        }
        catch(error){
            console.log("error fetching data", error);
            navigate('/login');
        }
    }


    const handleUpdate = (user) =>{
        setFormData({
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            gender: user.gender,
            jobTitle: user.jobTitle
        });
        setUpdateForm(true);
    }

    const handleDelete = (user) =>{
        setFormData({
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            gender: user.gender,
            jobTitle: user.jobTitle
        });
        setDeleteForm(true);
    }

    return (
        <div className="app">
            <h1 className="title">Employee Data Form</h1>
            <button type="submit" onClick={fetchData} className="action-button">Show Users</button>
            <div >
                {isFetched && (
                    <Table striped bordered hover>
                        <thead >
                            <tr>
                                <th>User ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Job Title</th>
                                <th>Update Action</th>
                                <th>Delete Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.userId}>
                                    <td>{user.userId}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.gender}</td>
                                    <td>{user.jobTitle}</td>
                                    <td>
                                        <button onClick={() => handleUpdate(user)} className="action-button">✎</button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleDelete(user)} className="action-button">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
            {updateForm && <EmployeeForm update={true} userData={formData} />}
            {deleteForm && <EmployeeForm update={false} userData={formData} deleted={true} />}
        </div>
    );
}

export default UserTable;
