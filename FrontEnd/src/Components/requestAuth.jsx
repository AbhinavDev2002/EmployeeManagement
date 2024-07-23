import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RequestAuth(props){
    const {userData} = props;

    const [allUsers, setAllUsers] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: 'Male',
        jobTitle: '',
        department : '',
        manager : '',
        leaves : null,
        sallary : null,
        role : 'User'
    });
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();


    const fetchData = async () =>{
        const response = await axios.get('http://localhost:8000/user/');
        // setIsFetched(true);
        setAllUsers(response.data);
    }

    useEffect(() => {
        fetchData()
    },[]);

    useEffect(() => {
        if (userData) {
            setFormData({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                gender: userData.gender,
            });
        }
    }, [userData]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.firstName.trim() === '' || formData.email.trim() === '') {
            let entry = '';
            if (formData.firstName.trim() === '') {
                entry += "First Name, ";
            }
            if (formData.email.trim() === '') {
                entry += "email";
            }
            alert(`${entry} is not entered please enter them`);
            return;
        }
        try {
            setSubmitted(true);
            
            await axios.patch("http://localhost:8000/user/request", formData);
            if(formData.manager !== ''){
                const emails = {reportingEmail :  formData.email, managerEmail : formData.manager};
                await axios.patch("http://localhost:8000/user/reporting", emails);
            }
            await axios.delete(`http://localhost:8000/request/${formData.email}`)
            navigate('/request');
        } 
        catch (error) {
            console.log(error);
        }
    };

    const handleReset = (e) => {
        e.preventDefault();
        setSubmitted(false);
        setFormData({
            jobTitle: '',
            department : '',
            leaves : null,
            sallary : null,
            role : 'User'
        });
    };

    return (
        <div className='container'>
            {!userData && <h2> Please specify your details and we will get back to you </h2>}
            <div className='form-container'>
                <h1 className='form-title'>Employee Data Form</h1>
                <form className='form'>
                    <input 
                        name='firstName' 
                        type='text' 
                        value={formData.firstName} 
                        placeholder='Enter First Name' 
                        onChange={handleFormChange} 
                        className='form-input'
                        disabled = {true}
                    />
                    <input 
                        name='lastName' 
                        type='text' 
                        value={formData.lastName} 
                        placeholder='Enter Last Name' 
                        onChange={handleFormChange} 
                        className='form-input'
                        disabled = {true}
                    />
                    <input 
                        name='email' 
                        type='email' 
                        value={formData.email} 
                        placeholder='Enter your Email' 
                        onChange={handleFormChange} 
                        className='form-input'
                        disabled = {true}
                    />
                    <select 
                        name='gender' 
                        value={formData.gender} 
                        onChange={handleFormChange} 
                        className='form-select'
                        disabled = {true}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    {/* Now I shall be adding an option here to select his manager */}
                    <input 
                        name='jobTitle' 
                        value={formData.jobTitle} 
                        type='text' 
                        placeholder='Enter job title' 
                        onChange={handleFormChange} 
                        className='form-input'
                    />
                    <input 
                        name='department' 
                        value={formData.department} 
                        type='text' 
                        placeholder='Enter department' 
                        onChange={handleFormChange} 
                        className='form-input'
                    />
                    <input 
                        name='leaves' 
                        value={formData.leaves} 
                        type='text' 
                        placeholder='Enter number of leaves' 
                        onChange={handleFormChange} 
                        className='form-input'
                    />
                    <input 
                        name='sallary' 
                        value={formData.sallary} 
                        type='text' 
                        placeholder='Enter sallary' 
                        onChange={handleFormChange} 
                        className='form-input'
                    />
                    {/* <DropdownButton
                        id="dropdown-basic-button"
                        title="Select Manager"
                        name = 'manager'
                        value = {formData.manager}
                        onSelect={handleDropdownChange}
                    >
                        {allUsers.map((item, index) => (
                        <Dropdown.Item key={index} eventKey={item}>
                            {item.firstName} -- {item.email}
                        </Dropdown.Item>
                        ))}
                    </DropdownButton> */}
                    <label> Enter Manager </label>
                    <select 
                        name='manager' 
                        value={formData.manager} 
                        onChange={handleFormChange} 
                        className='form-select'
                    >
                        <option value="">Select Manager</option>
                        {allUsers.map((item, index) => (
                            <option key={index} value={item.email}>
                                {item.firstName} -- {item.email}
                            </option>
                        ))}
                    </select>
                    <label>Enter User Access Role</label>
                    <select 
                        name='role' 
                        value={formData.role} 
                        onChange={handleFormChange} 
                        className='form-select'
                    >
                        <option value="">Select Role</option>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        <option value="HR">HR</option>
                        <option value="Super_Admin">Super Admin</option>
                    </select>
                    <button type='submit' onClick={handleSubmit} className='form-button'>Submit</button>
                    <button type='reset' onClick={handleReset} className='form-button'>Reset</button>
                </form>

                {submitted && (
                    <div className='result'>
                        <h2>Details Submitted</h2>
                        <p>First Name : {formData.firstName}</p>
                        <p>Last Name : {formData.lastName}</p>
                        <p>Email : {formData.email}</p>
                        <p>Gender : {formData.gender}</p>
                        <p>Job Title : {formData.jobTitle}</p>
                        <p>Department : {formData.department}</p>
                        <p>Leaves : {formData.leaves}</p>
                        <p>Sallary : {formData.sallary}</p>
                        <p>Role : {formData.role}</p>
                        <p>Manager : {formData.manager}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RequestAuth;
