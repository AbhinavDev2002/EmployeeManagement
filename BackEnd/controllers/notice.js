const notice = require('../models/notice');
const notice_Likes  = require('../models/Notice_Likes')

async function handleAllNotice(req, res){
    const uId = req.params.uId;
    if(!uId){
        return res.status(400).json({message : "These fields are required!"});
    }
    try{
        const allNotice = await notice.find({});
        const noticeData = await Promise.all (allNotice.map(async(notData) =>{

            const existInLike = await notice_Likes.findOne({noticeId : notData._id, userId : uId});
        
            if(!existInLike){
                return{
                    noticeId : notData._id,
                    title : notData.title,
                    content : notData.content,
                    
                    authorId : notData.authorId,
                    category : notData.category,
                    likes : notData.likes
                }
            }
            return null;
        }));
        const filteredNoticeData = noticeData.filter(notData => notData !== null) 
        return res.status(200).json(filteredNoticeData);
    }
    catch(error){
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function createNewNotice (req, res){
    const body = req.body;
    if(!body || !body.title || !body.content || !body.authorId){
        return res.status(400).json({message : "These fields are required!"});
    }
    try{
        const result = await notice.create({
            title : body.title,
            content : body.content,
            authorId : body.authorId,
            attachements : body.attachements,
            category : body.category,
            likes : body.likes,
        })
        console.log("Result : \n", result);
        return res.status(201).json({msg : "Success"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the notice" });
    }
}

async function handleLikeChange(req, res){
    const body = req.body;
    if(!body || !body.noticeId || !body.userId){
        return res.status(400).json({message : "These fields are required!"});
    }
    try{
        const filter = {noticeId : body.noticeId};
        const update = {$inc : {likes : 1}};

        const result = await notice.updateOne(filter, update);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Notice not found or data not modified" });
        }
        
        const likeResult = await notice_Likes.create({
            noticeId : body.noticeId,
            userId : body.userId,
            liked : true,
            deleted : false  
        })
        console.log("Result : \n", likeResult);
        res.status(200).json({ message: "Like updated successfully" });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "An error occurred while changing the like" });
    }
}

async function showLikes(req, res){
    const noticeId = req.params.noticeId
    try{
        const users = await notice_Likes.find({noticeId : noticeId, liked : true});
        return users.map(user => user.userId);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error fetching users who liked the notice:' });
    }
}

async function hideNotice(req, res){
    const body = req.body;
    if(!body || !body.noticeId || !body.userId){
        return res.status(400).json({message : `These fields are required! ${body.noticeId} ${body.userId}`});
    }

    try{
        const result = await notice_Likes.create({
            noticeId : body.noticeId,
            userId : body.userId,
            liked : false,
            deleted : true  
        })
        console.log("Result : \n", result);
        res.status(200).json({ message: "Like updated successfully" });   
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "An error occurred while hiding the post" });
    }
}

async function updateNotice(req, res){
    const body = req.body;
    if(!body || !body.title || !body.content || !body.authorId || !body.noticeId){
        return res.status(400).json({message : "These fields are required!"});
    }
    try{
        const oldNotice = await notice.findOne({ noticeId: body.noticeId });
        if(oldNotice.authorId !== body.authorId){
            return res.status(409).send("User not same");
        }
        const filter = body.noticeId;
        const update = {$set : {title : body.title, content : body.content}};

        const updateResult = await notice.updateOne(filter, update);
        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({ 'message': "User not found or data not modified" });
        }
        res.status(200).json({ 'message': "User updated successfully" });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "An error occurred while updating the notice" });
    }
}

async function deleteNotice(req, res){
    const noticeId = req.params.noticeId;
    const authorId = req.params.authorId;
    try{
        const oldNotice = await notice.findOne({ noticeId: noticeId });
        if(!oldNotice || oldNotice.authorId !== authorId){
            return res.status(409).send("User not same");
        }

        const result = await notice.deleteOne({ noticeId: noticeId });
        if (result.deletedCount === 0) {
          return res.status(500).send("Failed to delete the notice");
        }
        return res.status(200).send("Notice deleted successfully");
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "An error occurred while changing the like" });
    }
}

module.exports = {
    handleAllNotice,
    createNewNotice,
    handleLikeChange,
    showLikes,
    updateNotice,
    hideNotice,
    deleteNotice
}