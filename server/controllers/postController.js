const Post = require('../models/postModel');
const User =require('../models/userModel');
const mongoose=require('mongoose');


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
const createPost = async (req, res) => {
  const { title, content, image, url, votes, commentsCount } = req.body;

  try {
    const user_id = req.user._id;

    //  Fetch the username from the User model
    const user = await User.findById(user_id).select('username');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    //  Create the post with the username included
    const post = await Post.create({
      title,
      content,
      image,
      url,
      votes,
      commentsCount,
      user_id,
      username: user.username // set this manually
    });

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
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

//voting end point
const votePost = async (req, res) => {
  const { id } = req.params;
  const { voteChange } = req.body; // +1 or -1
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const existingVoteIndex = post.votedUsers.findIndex(
      v => v.userId.toString() === userId.toString()
    );

    if (voteChange === 0) {
  // Remove vote if exists
  const existingVoteIndex = post.votedUsers.findIndex(
    v => v.userId.toString() === userId.toString()
  );

  if (existingVoteIndex > -1) {
    const voteType = post.votedUsers[existingVoteIndex].voteType;
    post.votes += voteType === 'up' ? -1 : 1;
    post.votedUsers.splice(existingVoteIndex, 1);
    await post.save();
  }

  return res.status(200).json({
    votes: post.votes,
    votedUsers: post.votedUsers,
  });
}
    const newVoteType = voteChange > 0 ? 'up' : 'down';

    if (existingVoteIndex > -1) {
      const existingVote = post.votedUsers[existingVoteIndex];

      if (existingVote.voteType === newVoteType) {
        // 🔁 Same vote again -> undo vote
        post.votes -= voteChange;
        post.votedUsers.splice(existingVoteIndex, 1);
      }
 else {
        // 🔄 Switch vote type
       post.votes += voteChange - (existingVote.voteType === 'up' ? 1 : -1);
post.votedUsers[existingVoteIndex].voteType = newVoteType;
      }
    } else {
      // ✅ New vote
      post.votes += voteChange;
      post.votedUsers.push({ userId, voteType: newVoteType });
    }

    await post.save();

    res.status(200).json({
      votes: post.votes,
      votedUsers: post.votedUsers,
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not update vote' });
  }
};




module.exports={
    getPost,
    getPosts,
    createPost,
    deletePost,
    updatePost,
    getAllPosts,
    votePost 
}