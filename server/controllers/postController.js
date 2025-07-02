const Post = require('../models/postModel');
const User =require('../models/userModel');
const mongoose=require('mongoose');


// Get all posts (regardless of user)
const getAllPosts = async (req, res) => {
  try {
    const sort = req.query.sort || "new"; // default to newest, in this algo the time is given more importance
    
    const posts = await Post.find({});

    const rankedPosts = posts.map(post => {
      const ageInHours = (Date.now() - new Date(post.createdAt)) / (1000 * 60 * 60);
      const score = (post.votes * 2) + (post.commentsCount * 1.5) - (ageInHours * 0.5);
      return { ...post._doc, score };
    });

    let sortedPosts;
    if (sort === "top") { //uses score to short post, post with higher weight is seeen more, this is custom ranking algo
      sortedPosts = rankedPosts.sort((a, b) => b.score - a.score);
    } else {
      sortedPosts = rankedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json(sortedPosts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

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

//voting controller
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

//comment controller

// Fetch comments for a post
const getComments = async (req, res) => {
  const { id } = req.params; // Post ID

  try {
    const post = await Post.findById(id).select('comments');
    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

//add comment
const addComment = async (req, res) => {
  const { id } = req.params; // post ID
  const { text } = req.body;
  const userId =req.user._id; 
  const username = req.user.username;
  // '6819f8d55d68c0c4731a3955' hardcoded to test


  if (!text) return res.status(400).json({ error: 'Comment text required' });

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  post.comments.push({ userId, username, text });
  post.commentsCount = post.comments.length;
  await post.save();

  res.status(200).json(post.comments);
};

//delete comment
const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const comment = post.comments.id(commentId);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });

  // Check ownership
  if (comment.userId.toString() !== userId.toString()) {
    return res.status(403).json({ error: 'Unauthorized to delete this comment' });
  }

  comment.remove(); // Mongoose subdoc method
  post.commentsCount = post.comments.length;
  await post.save();

  res.status(200).json(post.comments); // return updated comments
};



module.exports={
    getPost,
    getPosts,
    createPost,
    deletePost,
    updatePost,
    getAllPosts,
    votePost,
    getComments,
    addComment,
    deleteComment 
}