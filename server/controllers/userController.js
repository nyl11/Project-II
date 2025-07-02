const User=require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken= (_id)=>{
  return  jwt.sign({_id},process.env.SECRET,{expiresIn:'3d'})
}

//login user
const loginUser=async(req,res)=>{
  const {username,password}=req.body
  try{
    const user=await User.login(username,password);

     //create a token
   const token = createToken(user._id) ;

    res.status(200).json({_id: user._id,username, token});
   }catch(error){
       res.status(400).json({error: error.message});
   }


    
}

//signup user
const signupUser=async(req,res)=>{
    const{username,email,password}=req.body;
    // console.log("Received:", req.body);

   

    try{
     const user=await User.signup(username,email,password);

      //create a token
    const token = createToken(user._id) ;

     res.status(200).json({_id: user._id,email,username, token});
    }catch(error){
        res.status(400).json({error: error.message});
    }
    
    
};
// controllers/userController.js

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // hide password
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

const editUserProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
module.exports = {
  signupUser,
  loginUser,
  getUserProfile,
  editUserProfile
};

module.exports={signupUser,loginUser, getUserProfile,editUserProfile}
