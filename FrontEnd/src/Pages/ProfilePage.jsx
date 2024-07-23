import React, { useEffect, useState, useContext, createContext } from "react";
import SideBar from "../Components/SideBar";
import '../Style/Profile.css'
import axios from "axios";
import userContext from "../Components/UserContext";
// Use multer library to handle file uploads

function Profile(){
    // const UserContext = createContext();
    const [file, setFile] = useState(null);
    // const user = useContext(userContext)
    
    const [loading, setLoading] = useState(true); // Add loading state
    const [userDetails, setUserDetails] = useState();

    useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userDetails'));
    if (user) {
        setUserDetails(user);
        setLoading(false);
    }
    }, []);


    if (loading) {
        return <div>Loading...</div>; // Display a loading message while fetching data
    }

    const handleFile = (e) => {
        setFile(e.target.files[0])
        // This means setting the first file from the files array
    } 

    const uploadFile = async (e) =>{
        try{
            e.preventDefault();
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.patch(`http://localhost:8000/user/uploadprofile/${userDetails.uId}`, formData,{
                headers : {"Content-Type" : "multipart/form-data"}
            })
            console.log(response);
        }
        catch(error){
            console.log(error);
        }
    }

    const isImageAvailaible = () =>{
        if(userDetails.profileImage ){
            return true;
        }
        return false;
    }

    return(
        <div>
            {/* <SideBar/> */}
            <div className="profile-container">
                <div className="profile-header">
                    <h1>User Profile</h1>
                </div>
            </div>
            <div className="profile-info">
                <form onSubmit={uploadFile}>
                    <input type="file" accept="image/*" onChange={handleFile}></input>
                    <button type="submit" >Upload</button>
                </form>
                <div className="profile-details">
                    {isImageAvailaible() && <img className="profile-picture" src= {require(`../../../../server/uploads/${userDetails.profileImage}`)} ></img>}
                    {!isImageAvailaible() && <img className="profile-picture" src= {require('../ProfileImage.jpg')} ></img>}
                    <p>First Name : {userDetails.firstName}</p>
                    <p>Last Name : {userDetails.lastName}</p>
                    <p>Email : {userDetails.email}</p>
                    <p>Job Title : {userDetails.jobTitle}</p>
                </div>
            </div>
        </div>
    )
}

export default Profile;