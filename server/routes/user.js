const express = require('express')

//controller function 
const {signupUser,loginUser,getUserProfile,editUserProfile}= require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth');

const router = express.Router()

//login route
router.post('/login',loginUser)
//signup route
router.post('/signup',signupUser)

router.get('/profile', requireAuth, getUserProfile);
router.put('/profile', requireAuth, editUserProfile);

module.exports=router