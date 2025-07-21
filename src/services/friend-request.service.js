import FriendRequest from "../models/friend-request.model.js"
import { AuthFailureError, NotFoundError, BadRequestError } from "../handler/error-response.js"
import mongoose from "mongoose"

class FriendRequestService {
  sendRequest = async (senderId, receiverId) => {
    const friendRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId })
    if (friendRequest) {
      throw new Error('Friend request already sent')
    }

    const newRequest = new FriendRequest({ sender: senderId, receiver: receiverId })
    await newRequest.save()
    return newRequest
  }

  acceptRequest = async (requestId) => {
    const request = await FriendRequest.findById(requestId)
    if (!request) {
      throw new NotFoundError('Friend request not found')
    }

    request.status = 'accepted'
    await request.save()
    return request
  }

  rejectRequest = async (requestId) => {
    const request = await FriendRequest.findById(requestId)
    if (!request) {
      throw new NotFoundError('Friend request not found')
    }
    request.status = 'rejected'
    await request.save()
    return request
  }

  getReceiverRequests = async (userId) => {
    const requests = await FriendRequest.find({ 
      receiver: userId, status: 'pending' 
    }).populate('sender', 'username avatar')

    if (!requests.length) {
      throw new NotFoundError('No pending friend requests found')
    }
    return requests
  }

  getSenderRequests = async (userId) => {
    const requests = await FriendRequest.find({
      sender: userId, status: 'pending'
    }).populate('receiver', 'username avatar')

    if (!requests.length) {
      throw new NotFoundError('No pending friend requests found')
    }
    return requests
  }

  cancelRequest = async (requestId, userId) => {
    const request = await FriendRequest.findById(requestId)
    if (!request) {
      throw new NotFoundError('Friend request not found')
    }

    if (request.sender.toString() !== userId.toString()) {
      throw new AuthFailureError('Unauthorized to cancel this request')
    }

    await FriendRequest.deleteOne({ _id: requestId })
    return { message: 'Friend request cancelled successfully' }
  }

  unFriend = async (userId, friendId) => {

    const senderId = new mongoose.Types.ObjectId(userId)
    const receiverId = new mongoose.Types.ObjectId(friendId)
    
    const friendRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ],
      status: 'accepted'
    })

    if (!friendRequest) {
      throw new NotFoundError('Friend request not found')
    }

    await FriendRequest.deleteOne({ _id: friendRequest._id })
    return { message: 'Unfriended successfully' }
  }

  getFriendList = async (userId) => {
    const requests = await FriendRequest.find({
      $or: [
        { sender: userId, status: 'accepted' },
        { receiver: userId, status: 'accepted' }
      ]
    }).populate('sender receiver', 'username avatar')

    if (!requests.length) {
      throw new NotFoundError('No friends found')
    }

    return requests.map(request => ({
      friend: request.sender._id.toString() === userId ? request.receiver : request.sender,
      status: request.status
    }))
  }
}

export default new FriendRequestService()