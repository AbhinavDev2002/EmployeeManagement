import React from "react";
import '../Style/NavBarStyle.css';
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div className="custom-navbar">
            <div className="custom-nav-left">
                <ul className="custom-nav-links">
                    <li><Link to="/">Home Page</Link></li>
                </ul>
            </div>
            <div className="custom-nav-center">
                <ul className="custom-nav-links">
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/new">User Admin Registration</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                </ul>
            </div>
            <div className="custom-nav-right">
                <ul className="custom-nav-links">
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Sign Up</Link></li>
                </ul>
            </div>
        </div>
    );
}

export default Navbar;
