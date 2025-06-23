const Post = require('../models/postModel')
const mongoose=require('mongoose')


// Get all posts (regardless of user)
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 })
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' })
    }
}

// get post(of specific user)

const getPosts=async(req,res)=>{
        const user_id = req.user._id
    
    const posts= await Post.find({ user_id }).sort({createdAt:-1})

    res.status(200).json(posts)
}


//get single post
const getPost=async(req,res)=>{
    const {id}=req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'no such post'})
    }
    const post = await Post.findById(id)


    if(!post){
        return res.status(404).json({error:'No such post'})
    }
    res.status(200).json(post)

}

//ceate new post
const createPost =async(req,res)=>{
    const {title,content,image,url,votes,commentsCount}=req.body

     // add a doc to db

    try{
        const user_id= req.user._id
        const post= await Post.create({title,content,image,url,votes,commentsCount,user_id })
        res.status(200).json(post)
    }catch(error){
          res.status(400).json({error: error.message})
    }
}
//delete a post
const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such post' });
    }

    const post = await Post.findById(id);

    if (!post) {
        return res.status(404).json({ error: 'No such post' });
    }

    // Check ownership
    // if (post.user._id !== req.user._id) {
    //     return res.status(403).json({ error: 'You are not authorized to delete this post' });
    // }
    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
    

};



//update post
const updatePost = async (req,res)=>{

    const {id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'No such post'})
    }

    const post =await Post.findByIdAndUpdate({_id: id},{
        ...req.body
    })

    if(!post){
        return res.status(404).json({error:'No such post'})
    }
    res.status(200).json(post)
}

module.exports={
    getPost,
    getPosts,
    createPost,
    deletePost,
    updatePost,
    getAllPosts
}