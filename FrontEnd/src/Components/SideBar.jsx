import { Link } from "react-router-dom";
import { useEffect, React, useState } from "react";
// import '../Style/Sidebar.css';
import '../Style/Sidebar2.css';
import UserState from "./Context";
function SideBar(){

    const [userDetails, setUserDetails] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isHR, setIsHR] = useState(false);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userDetails'));
        if (user) {
            setUserDetails(user);
        }
        if(userDetails.role == "Admin"){
            setIsAdmin(true);
        }
        if(userDetails.role == "HR"){
            setIsHR(true);
        }
        if(userDetails.role == "Super_Admin"){
            setIsHR(true);
            setIsAdmin(true);
        }
        else{
            setIsAdmin(false);
            setIsHR(false);
        }

        
    }, []);
    
    return(
        <div className="sidebar">
            <div className="sidebar-container">Home Page</div>
                <div className="links">
                    
                    <ul >
                        <li><Link className="link" to ='/table'>Show Users</Link></li>
                        <li><Link className="link" to ='/attendance'>Show Attendance</Link></li>
                        <li><Link className="link" to ='/sallary'>Show Sallary</Link></li>
                        <li><Link className="link" to ='/leaves'>Show Leaves</Link></li>
                        <li><Link className="link" to ='/profile'>Show Profile</Link></li>
                        {(isAdmin || isHR) && <li><Link className="link" to = '/new'>Employee Registration</Link></li>}
                        {(isAdmin || isHR) && <li><Link className="link" to = '/request'>Pending Employee Request</Link></li>}
                        {/* {user.reportingEmail.length > 0 && <li><Link to = '/request'>Pending Employee Request</Link></li>} */}
                    </ul>
                    
                </div>
        </div>
    )
}

export default SideBar;