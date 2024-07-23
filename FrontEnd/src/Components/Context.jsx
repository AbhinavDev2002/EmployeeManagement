import {React, createContext, useState, useEffect} from "react";

function UserState(props){
    const [userDetails, setUserDetails] = useState({
        uId : '',
        firstName : '',
        lastName : '',
        email : '',
        gender : '',
        jobTitle : '',
        department : '',
        attendance : {},
        leaves : null,
        performance : {},
        sallary : null,
        role : '',
        profileImage : '',
        manager : '',
        reporting : []
    });
    const UserContext = createContext();


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userDetails'));
        if (user) { 
            const userData = user;
            // debugger;
            setUserDetails({
                uId : userData['uId'], 
                firstName : userData['firstName'], 
                lastName : userData['lastName'], 
                email : userData['email'],
                gender : userData['gender'],
                jobTitle : userData['jobTitle'],
                department : userData['department'],
                attendance : userData['attendance'],
                leaves : userData['leaves'],
                performance : userData['performance'],
                sallary : userData['sallary'],
                role : userData['role'],
                profileImage : userData['profileImage'],
                manager : userData['manager'],
                reporting : userData['reporting']
            })
            console.log(user.data)
            console.log(userDetails)
        }
    }, []);

    return(
        
        <UserContext.Provider value={userDetails}>
            {props.children}
        </UserContext.Provider> 
        
    );
}

export default UserState;