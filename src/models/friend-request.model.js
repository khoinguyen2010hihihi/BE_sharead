import mongoose from "mongoose"

const FriendRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
    required: true
  }
}, {
  timestamps: true,
})

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema)

export default FriendRequest