import { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/formStyle.css';
import { useNavigate } from 'react-router-dom';
const validator = require('validator');

function SignUp() {
    const [submitted, setSubmitted] = useState(false);
    const [signUpData, setSignUpData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password : '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const togglePasword = () =>{
        setShowPassword(!showPassword);
    }

    const navigate = useNavigate();
    
    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        if (signUpData.firstName.trim() === '' || signUpData.email.trim() === '' || signUpData.password.trim() === '') {
            let entry = '';
            if (signUpData.firstName.trim() === '') {
                entry += "First Name, ";
            }
            if (signUpData.email.trim() === '') {
                entry += "email, ";
            }
            if (signUpData.password.trim() === '') {
                entry += "password";
            }
            alert(`${entry} is not entered please enter them`);
            return;
        }
        if(signUpData.password.trim().length < 6){
            alert("Password length should be greater than 8");
            return;
        }
        if(!validator.isEmail(signUpData.email)){
            alert("Please input a valid email");
            return;
        }
        try {
            setSubmitted(true);
            await axios.post("http://localhost:8000/user/signup", signUpData);
            navigate('/login');
        } 
        catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='container'>
            <div className='form-container'>
                <h1 className='form-title'>Employee SignUp form</h1>
                <form className='form'>
                    <input className='form-input' name='firstName' type='text' value={signUpData.firstName} placeholder='Enter First Name' onChange={handleSignUpChange} />
                    <input className='form-input' name='lastName' type='text' value={signUpData.lastName} placeholder='Enter Last Name' onChange={handleSignUpChange}  />
                    <input className='form-input' name='email' type='email' value={signUpData.email} placeholder='Enter your Email' onChange={handleSignUpChange}  />
                    <input className='form-input' name = 'password' type={showPassword ?'text':'password'} placeholder='Enter your password' value={signUpData.password }  onChange={handleSignUpChange} />
                    <button className='form-button' placeholder = 'ViewPassword' onClick={togglePasword}></button>
                    <button className='form-button' type='submit' onClick={handleSignUpSubmit}>SignUp</button>
                </form>

                {submitted && (
                    <div className='result'>
                        <div>
                            <h2>Welcome {signUpData.firstName}</h2>
                            
                            <p> Created User with Credentials</p>
                            <p>First Name: {signUpData.firstName}</p>
                            <p>Last Name: {signUpData.lastName}</p>
                            <p>Email: {signUpData.email}</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default SignUp;
