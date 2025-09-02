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

  getStatus = async (userId, otherUserId) => {
    const request = await FriendRequest.findOne({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
    if (!request) {
      return { status: 'none', requestId: null, sender: null, receiver: null }
    }
    return { status: request.status, requestId: request._id, sender: request.sender, receiver: request.receiver }
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
    await request.deleteOne()
    return { message: 'Friend request deleted' }
  }

  getReceiverRequests = async (userId) => {
    const requests = await FriendRequest.find({ 
      receiver: userId, status: 'pending' 
    }).populate('sender', 'username avatar')

    // Return empty array instead of throwing an error when no pending requests
    if (!requests || !requests.length) {
      return []
    }
    return requests
  }

  getSenderRequests = async (userId) => {
    const requests = await FriendRequest.find({
      sender: userId, status: 'pending'
    }).populate('receiver', 'username avatar')

    if (!requests || !requests.length) {
      return []
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

  /**
   * Get list of users who sent friend requests to this user and were accepted.
   * Returns array of objects: { friend: User, status: String }
   * If none found, returns [] (not an error).
   */
  getIncomingFriendList = async (userId) => {
    const requests = await FriendRequest.find({
      receiver: userId,
      status: 'accepted'
    }).populate('sender', 'username avatar')

    if (!requests || !requests.length) {
      return []
    }

    return requests.map(request => ({
      friend: request.sender,
      status: request.status
    }))
  }

  /**
   * Get friend list for user (both directions). Returns [] if none.
   */
  getFriendList = async (userId) => {
    const requests = await FriendRequest.find({
      $or: [
        { sender: userId, status: 'accepted' },
        { receiver: userId, status: 'accepted' }
      ]
    }).populate('sender receiver', 'username avatar')

    if (!requests || !requests.length) {
      return []
    }

    return requests.map(request => ({
      friend: request.sender._id.toString() === userId ? request.receiver : request.sender,
      status: request.status
    }))
  }
}

export default new FriendRequestService()