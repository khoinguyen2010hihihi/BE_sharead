import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 280
  },
  image: {
    type: String,
    default: '',
    trim: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  repostFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
}, 
  {
    timestamps: true,
  })

const Post = mongoose.model("Post", postSchema)
export default Post