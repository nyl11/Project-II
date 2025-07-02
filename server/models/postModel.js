const mongoose= require('mongoose')

const Schema =mongoose.Schema



const postSchema = new mongoose.Schema({
  title: { type: String,
     required: true, 
     trim: true },
  content: String,
  image: String,
  url: String,
   user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // usermodel
    required: true
  },
  username :{
    type: String,
    required:true
  },
  votes: {
    type: Number,
    default: 0
  },
  votedUsers: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    voteType: { type: String, enum: ['up', 'down'] } // Track type of vote
  }
],
comments: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }
],
  commentsCount: {
    type: Number,
    default: 0
  }
 
},{timestamps:true});

module.exports= mongoose.model('Post',postSchema)

