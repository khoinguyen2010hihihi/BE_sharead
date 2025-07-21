import friendRequestService from "../services/friend-request.service.js"
import { CREATED, OK } from '../handler/success-response.js'

class FriendRequestController {
  sendFriendRequest = async (req, res) => {
    const { receiver } = req.body
    const request = await friendRequestService.sendRequest(req.user._id, receiver)

    res.status(201).json(new CREATED({
      message: 'Friend request sent successfully',
      metadata: request
    }))
  }

  acceptFriendRequest = async (req, res) => {
    const { requestId } = req.params
    const request = await friendRequestService.acceptRequest(requestId)

    res.status(200).json(new OK({
      message: 'Friend request accepted successfully',
      metadata: request
    }))
  }

  rejectFriendRequest = async (req, res) => {
    const { requestId } = req.params
    const request = await friendRequestService.rejectRequest(requestId)

    res.status(200).json(new OK({
      message: 'Friend request rejected successfully',
      metadata: request
    }))
  }

  getPendingRequests = async (req, res) => {
    const requests = await friendRequestService.getRequestsByUser(req.user._id)

    res.status(200).json(new OK({
      message: 'Pending friend requests retrieved successfully',
      metadata: requests
    }))
  }
}

export default new FriendRequestController()