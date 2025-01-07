
const Post = require("../model/Post.model")

const uploadPost = async (req,res) => {

    const postData = req.body

    if(!postData){
        return res.status(400).json({"message":"post data not found"})
    }

    //send data to database
    const response = await Post.create({
        title : postData.title,
        content: postData.content,
        tags: postData.tags
    })

    if(!response){
        return res.status(500).json({"message":"fail to save post into database"})
    }

    res.status(200).json({
        "message":"post have been saved successfully"
    })

}

module.exports = uploadPost