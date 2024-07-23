import React from "react";

function WelcomePage(props){
    const {userData} = props;
    const firstName = userData.firstName;
    console.log(userData)
    return(
        <div>
            <h1>Welcome to Employee Management System {firstName} </h1>
            <h2>Explore all details here</h2>
            <p>The number of leaves is {userData.leaves}</p>
        </div>
    );
} 

export default WelcomePage