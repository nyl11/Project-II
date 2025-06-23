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
    ref: 'User', // assuming you have a User model
    required: true
  },
  username{

  },
  votes: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  }
 
},{timestamps:true});

module.exports= mongoose.model('Post',postSchema)

