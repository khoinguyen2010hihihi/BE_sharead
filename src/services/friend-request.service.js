import FriendRequest from "../models/friend-request.model.js"
import { NotFoundError } from "../handler/error-response.js"

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
}

export default new FriendRequestService()