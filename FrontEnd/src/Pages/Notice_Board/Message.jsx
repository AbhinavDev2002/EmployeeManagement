import axios from 'axios';
import './CSS/Message.css';
import React, { useState, useEffect } from 'react'
import MessageForm from './messageForm';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


const Message = (props) => {
    const {title, category, content, likes, noticeId, authorId, userId} = props;
    const [submitted, setSubmitted] =  useState(false);
    const [hideSubmitted, setHideSubmitted] =  useState(false);
    const [updateForm, setUpdateForm] = useState(false);
    const [authorDetails, setAuthorDetails] = useState([]);
    const [likedUsers, setLikedUsers] = useState([]);

    const getAuthorDetails = async ()=>{
        try{
            const response = await axios.get(`http://localhost:8000/user/notice/${authorId}`);
            setAuthorDetails(response.data);
            
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() =>{
        getAuthorDetails();
    }, [])

    const showLikes = async () => {
        try{
            const likeResponses = await axios.get(`http://localhost:8000/notice/like/${noticeId}`);
            setLikedUsers(likeResponses.data);
            debugger;
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() =>{
        // debugger;
        showLikes();
    }, [noticeId])

    

    const handleLikeChange = async (e) =>{
        e.preventDefault();
        const data = {noticeId : noticeId, userId : userId};
        const response = await axios.post("http://localhost:8000/notice/update_like",data);
        if(response.status === 200){
            setSubmitted(true);
        }
    };

    const handleHideChange = async (e) =>{
        e.preventDefault();
        const data = {noticeId : noticeId, userId : userId};
        
        const response = await axios.post("http://localhost:8000/notice/hide",data);
        if(response.status === 200){
            setHideSubmitted(true);
        }
    };

    const handleUpdate = () =>{
        setUpdateForm(true);
    }

    const validateAuthorUser = () =>{
        if(userId === authorId){
            return true;
        }
        return false;
    }

    return (
        <div className='outer-message-container'>
            <div className='message__container'>
                <div className='message__row'>
                    <p className='message__title'>Author_Name : {authorDetails.firstName}</p>
                    <p className='message__author'>Author_Department: {authorDetails.department}</p>
                    <p className='message__author'>Author_JobTitle: {authorDetails.jobTitle}</p>
                </div>
                <div className='message__row'>
                    <h2 className='message__title'>Title : {title}</h2>
                    <p className='message__author'>Category: {category}</p>
                </div>
                <p>Message:</p>
                <p className='message__body'>{content}</p>
                <p className='message__date'>{likes}</p>
                <p className='message__date'> {}</p>
                <p>Likes: {likes}</p>
            </div>
            <label>Click the button to like the post</label>
            <button className='submit-button' onClick={handleLikeChange} type='submit'>Like Post</button>
            <button className='submit-button' onClick={handleHideChange} type='submit'>Hide Post</button>
            {validateAuthorUser() && <button className='submit-button' onClick={handleUpdate} type='submit'>Edit Post</button>}
            {submitted && <p>The post has been liked</p>}
            {hideSubmitted && <p>The post has been hidden</p>}
            
            <DropdownButton id="dropdown-basic-button" title="Users Liked Post">
                {likedUsers.map((item, index) => (
                    <Dropdown.Item key={index} >
                    {item.label}
                    </Dropdown.Item>
                ))}
            </DropdownButton>
    
            {updateForm && <MessageForm title ={title} category={category} content = {content} authorId = {authorId} noticeId = {noticeId} />}
        </div>
  )
}

export default Message;