import { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/formStyle.css';
import { useNavigate } from 'react-router-dom';

function EmployeeForm(props) {
    const { submit, update, userData, deleted} = props;
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: 'Male',
        jobTitle: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [del, setDeleted] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const navigate = useNavigate();


    // Here we have used useEffect() it is used to load the items when in it when the load renders
    // It means that when the page will be rendered useEffect will action and will make run when there are changes in the result array
    // Here it is userData
    useEffect(() => {
        if (userData) {
            setFormData({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                gender: userData.gender,
                jobTitle: userData.jobTitle
            });
        }
    }, [userData]);

    useEffect(() =>{
        if(deleted){
            setIsDisabled(true);
        }
    }, [deleted]);

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
            await axios.post("http://localhost:8000/user", formData);
            navigate('/login');
        } 
        catch (error) {
            console.log(error);
            navigate('/login');
        }
    };

    const handleUpdate = async (e) => {
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
            setUpdated(true);
            await axios.patch(`http://localhost:8000/user/${userData.userId}`, formData);
            navigate('/table');
        } catch (error) {
            console.log("Error patching data", error);
            navigate('/login');
        }
    };

    const handleDelete = async(e) => {
        e.preventDefault();
        try {
            setSubmitted(true);
            setDeleted(true);
            await axios.delete(`http://localhost:8000/user/${userData.userId}`);
            navigate('/table');
        }
        catch(error){
            console.log("Error deleting user", error);
            navigate('login');
        }
    }

    const handleReset = (e) => {
        e.preventDefault();
        setSubmitted(false);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            gender: 'Male',
            jobTitle: ''
        });
    };

    return (
        <div className='container'>
            <div className='form-container'>
                <h1 className='form-title'>Employee Data Form</h1>
                {update && <h1 className='form-title'>Employee Details Update Form</h1>}
                {deleted && <h1 className='form-title'>Employee Details Delete Form</h1>}
                <form className='form'>
                    <input 
                        name='firstName' 
                        type='text' 
                        value={formData.firstName} 
                        placeholder='Enter First Name' 
                        onChange={handleFormChange} 
                        disabled={isDisabled}
                        className='form-input'
                    />
                    <input 
                        name='lastName' 
                        type='text' 
                        value={formData.lastName} 
                        placeholder='Enter Last Name' 
                        onChange={handleFormChange} 
                        disabled={isDisabled}
                        className='form-input'
                    />
                    <input 
                        name='email' 
                        type='email' 
                        value={formData.email} 
                        placeholder='Enter your Email' 
                        onChange={handleFormChange} 
                        disabled={isDisabled}
                        className='form-input'
                    />
                    <select 
                        name='gender' 
                        value={formData.gender} 
                        onChange={handleFormChange} 
                        disabled={isDisabled}
                        className='form-select'
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <input 
                        name='jobTitle' 
                        value={formData.jobTitle} 
                        type='text' 
                        placeholder='Enter job title' 
                        onChange={handleFormChange} 
                        disabled={isDisabled}
                        className='form-input'
                    />
                    {submit && <button type='submit' onClick={handleSubmit} className='form-button'>Submit</button>}
                    {update && <button type='button' onClick={handleUpdate} className='form-button'>Update</button>}
                    {deleted && <button type='button' onClick={handleDelete} className='form-button'>Delete</button>}
                    <button type='reset' onClick={handleReset} disabled={isDisabled} className='form-button'>Reset</button>
                </form>

                {submitted && (
                    <div className='result'>
                        <h2>Result</h2>
                        {del && <p>Deleted User with Credentials</p>}
                        {updated && <p>Updated User with Credentials</p>}
                        <p>First Name: {formData.firstName}</p>
                        <p>Last Name: {formData.lastName}</p>
                        <p>Email: {formData.email}</p>
                        <p>Gender: {formData.gender}</p>
                        <p>Job Title: {formData.jobTitle}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployeeForm;
