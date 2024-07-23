import React, { useEffect, useState, createContext } from "react";
import SideBar from "./SideBar";
import '../Style/Dashboard.css'
import Notice_Board from "../Pages/Notice_Board/notice_board";
// import {} from antd
// import { Form } from "antd";
function Dashboard() {

    const [loading, setLoading] = useState(true); // Add loading state
    const [userDetails, setUserDetails] = useState();

    useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userDetails'));
    if (user) {
        setUserDetails(user);
        console.log(user)
        console.log(userDetails)
        setLoading(false);
    }
    }, []);


    if (loading) {
        return <div>Loading...</div>; // Display a loading message while fetching data
    }

    return (
        // <UserState>
            <div className="app">
                <div className="container">
                    <SideBar />
                    {/* {console.log(user.firstName)} */}
                    <div className="welcome-page">
                        {/* <WelcomePage userData={userDetails} /> */}
                        <Notice_Board uId = {userDetails.uId} name = {userDetails.firstName}/>
                    </div>
                </div>
            </div>
        // </UserState>
    );
}

export default Dashboard;
