const Post = require('../models/postModel')
const mongoose=require('mongoose')

//get all post
const getPosts=async(req,res)=>{
    const posts= await Post.find({}).sort({createdAt:-1})

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
        const post= await Post.create({title,content,image,url,votes,commentsCount })
        res.status(200).json(post)
    }catch(error){
          res.status(400).json({error: error.message})
    }
}
//delete a post
const deletePost= async (req,res)=>{

    const {id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'No such post'})
    }

    const post = await Post.findOneAndDelete({_id: id})
   
    if(!post){
        return res.status(404).json({error:'No such post'})
    }
    res.status(200).json(post)

    }

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
    updatePost
}