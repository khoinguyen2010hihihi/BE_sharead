import FriendRequest from "../models/friend-request.model.js"
import { AuthFailureError, NotFoundError, BadRequestError } from "../handler/error-response.js"

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

  getRequestsByUser = async (userId) => {
    const requests = await FriendRequest.find({ receiver: userId, status: 'pending '})
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
    const friendRequest = await FriendRequest.findOne({ sender: userId, receiver: friendId })
    if (!friendRequest) {
      throw new NotFoundError('Friend request not found')
    }

    if (friendRequest.status !== 'accepted') {
      throw new BadRequestError('Cannot unfriend a user who is not a friend')
    }

    await FriendRequest.deleteOne({ _id: friendRequest._id })
    return { message: 'Unfriended successfully' }
  }
}

export default new FriendRequestService()