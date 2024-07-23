// This page will be made for requesting access to users functionalities  
// In this form we shall be asking users for giving request to the person for setting up his data in the user database
// And also specify his role

import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import '../Style/formStyle.css'
function ContactRegistration(){

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: 'Male',
        jobTitle: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

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
            await axios.post("http://localhost:8000/request/", formData);
            navigate('/');
        } 
        catch (error) {
            console.log(error);
        }
    };

    const handleReset = (e) => {
        e.preventDefault();
        setSubmitted(false);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            gender: 'Male'
        });
    };

    return (
        <div className='container'>
            <h2> Please specify your details and we will get back to you </h2>
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
                    />
                    <input 
                        name='lastName' 
                        type='text' 
                        value={formData.lastName} 
                        placeholder='Enter Last Name' 
                        onChange={handleFormChange} 
                        className='form-input'
                    />
                    <input 
                        name='email' 
                        type='email' 
                        value={formData.email} 
                        placeholder='Enter your Email' 
                        onChange={handleFormChange} 
                        className='form-input'
                    />
                    <select 
                        name='gender' 
                        value={formData.gender} 
                        onChange={handleFormChange} 
                        className='form-select'
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>

                    <button type='submit' onClick={handleSubmit} className='form-button'>Submit</button>
                    <button type='reset' onClick={handleReset} className='form-button'>Reset</button>
                </form>

                {submitted && (
                    <div className='result'>
                        <h2>Details Submitted</h2>
                        <p>First Name: {formData.firstName}</p>
                        <p>Last Name: {formData.lastName}</p>
                        <p>Email: {formData.email}</p>
                        <p>Gender: {formData.gender}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContactRegistration;
