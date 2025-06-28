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

     res.status(200).json({email,username, token});
    }catch(error){
        res.status(400).json({error: error.message});
    }
    
    
};

module.exports={signupUser,loginUser}
