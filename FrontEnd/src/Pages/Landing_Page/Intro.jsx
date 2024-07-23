import React from "react";
import './css/intro.css'
function Introduction(){

    return(
        <div class="container">
            <div class="text">
                <h1>Welcome to Employee Management System</h1>
                <p>Software application for helping companies manage employee information, track attendance, and message users efficiently.</p>
            </div>
            <div class="image">
                <img src={require("./data/Main.jpg")} alt="Employee Management"/>
            </div>
        </div>
    );
}

export default Introduction;