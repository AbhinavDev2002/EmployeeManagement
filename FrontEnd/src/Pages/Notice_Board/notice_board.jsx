// File which will be showing notice board
import React, { useEffect, useState } from "react";
import './CSS/NoticeBoard.css'
import Message from "./Message";
import MessageForm from "./messageForm";
import axios from "axios";

function Notice_Board(props){
    const {uId, name} = props;
    const [noticeMessage, setNoticeMessgae] = useState([]);

    const fetchData = async() =>{
        try{
            const response = await axios.get(`http://localhost:8000/notice/${uId}`);
            setNoticeMessgae(response.data);
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() =>{
        fetchData();
    }, [])

    return(
            <div className="notice-body">
                <div className="wrapper">
                    <p>Welcome to Employee Management System {name}</p>
                    <h1 className='notice-title'>Notice Board</h1>
                    <MessageForm uId = {uId} />

                    {noticeMessage.map(notice=>(
                        <Message key = {notice.noticeId}
                            authorId ={notice.authorId}
                            title = {notice.title} 
                            category = {notice.category} 
                            noticeId = {notice.noticeId} 
                            content = {notice.content}
                            userId = {uId} 
                            likes = {notice.likes} />
                    ))}
                </div>
            </div>
    );
}

export default Notice_Board;