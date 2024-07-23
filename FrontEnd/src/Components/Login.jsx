import { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/formStyle.css';
import {useNavigate } from 'react-router-dom';
const validator = require('validator');

function Login() {

    const [submitted, setSubmitted] = useState(false);
    const [loginData, setLoginData] = useState({
        email: "",
        password : ""
    });
    const [userDetails, setUserDetails] = useState()

    // In this ...loginData in it, it creates a deep copy of previous filled data and then add the value correspos

    const handleLoginChange = (e) =>{
        const {name, value} = e.target;
        const newData = {
            ...loginData,
            [name] : value
        } 
        setLoginData(newData);
    };

    const navigate = useNavigate();
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (loginData.email.trim() === '' || loginData.password.trim() === '') {
            let entry = '';
            if (loginData.email.trim() === '') {
                entry += "email, ";
            }
            if (loginData.password.trim() === '') {
                entry += "password";
            }
            alert(`${entry} is not entered please enter them`);
            return;
        }
        if(loginData.password.trim().length < 6){
            alert("Password length should be greater than 8");
            return;
        }
        if(!validator.isEmail(loginData.email)){
            alert("Please input a valid email");
            return;
        }
        try {
            setSubmitted(true);
            // console.log(loginData);
            const response = await axios.post("http://localhost:8000/user/login", loginData);
            const userDetails = await axios.get(`http://localhost:8000/user/login/${loginData.email}`);
            if(userDetails.status === 200){
                localStorage.setItem('userDetails', JSON.stringify(userDetails.data));
            }
            if(response.status === 200){
                navigate('/dashboard');
            }
        } 
        catch (error) {
            console.log(error);    
        }
    }

    return (
        <div className='container'>
            <div className='form-container'>
                <h1 className='form-title'>Employee Login form</h1>
                <form className='form'>
                    <input name='email' type='email' value= {loginData.email} placeholder='Enter your Email' onChange={handleLoginChange} className='form-input'  />
                    <input name = 'password' type='password' placeholder='Enter your password' value={loginData.password}  onChange={handleLoginChange} className='form-input' />
                    <button type='submit' onClick={handleLoginSubmit} className='form-button'>Login</button>
                </form>

                {submitted && (
                    <div className='result'>
                        <div>
                            <h2> User Logged In with Credentials</h2>
                            {/* <p>First Name: {loginData.firstName}</p> */}
                            <p>Email: {loginData.email}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
