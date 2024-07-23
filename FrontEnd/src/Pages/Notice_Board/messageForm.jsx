import axios from 'axios';
import './CSS/MessageForm.css';
import React from 'react';
import { useState, useEffect } from 'react';

function MessageForm(props){
    const {uId, title, category, content, authorId, noticeId} = props;
    const [submitted, setSubmitted] = useState(false);
    const [updateForm, setUpdateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category : "",
        content : "",
        attachements : "",
        authorId : "",
        likes : 0
    });

    useEffect(() => {
        if (authorId && (title || content || category)) {
            setUpdateForm(true);
            setFormData({
                title: title,
                category: category,
                content: content,
                authorId: authorId,
                // attachements : attachements
            });
        }
    }, []);

    const handleFormChange = (e) =>{
        const {name, value} = e.target;
        const newData = {
            ...formData,
            [name] : value
        } 
        setFormData(newData);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if(updateForm){
            if(formData.title.trim() === '' || formData.content.trim() === ''){
                alert("Please fill all of the boxes mentioned");
            }
            try{
                const newData = {
                    ...formData,
                    'noticeId' : noticeId
                };
                const response = await axios.patch("http://localhost:8000/notice/update",newData);
                if(response.status === 200){
                    setSubmitted(true);
                }
            }
            catch(error){
                console.log(error);
            }
        }
        else{
            const newData = {
                ...formData,
                'authorId' : uId
            }
            setFormData(newData);

            if(formData.title.trim() === '' || formData.content.trim() === ''){
                alert("Please fill all of the boxes mentioned");
            }
            try{
                
                const response = await axios.post("http://localhost:8000/notice/",formData);
                if(response.status === 200){
                    setSubmitted(true);
                }
            }
            catch(error){
                console.log(error);
            }
        }
    }

  return (
    <div>
        <form className="form__container">
            <div className="form__row">
            <input className='input-field' name='title'  value={formData.title} placeholder='Title' type="text" maxLength="30" onChange={handleFormChange}></input>
            <input className='input-field' name='category' value={formData.category} id="iAuthor" placeholder='Category' type="text" maxLength="20" onChange={handleFormChange}></input>
            </div>

            <div className="form__row body__row">
            <textarea className='textarea-field' name='content' value={formData.content} placeholder='Enter the Message' type="text" maxLength="500" onChange={handleFormChange}></textarea>
            </div>

            <button className='submit-button' type="submit" onClick={handleFormSubmit}>Submit</button>
        </form>
        {submitted && <p> The Notice is submitted </p>}
    </div>
  )
}

export default MessageForm;