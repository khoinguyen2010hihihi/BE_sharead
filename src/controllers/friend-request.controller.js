import friendRequestService from "../services/friend-request.service.js"
import { CREATED, OK } from '../handler/success-response.js'

class FriendRequestController {
  sendFriendRequest = async (req, res) => {
    const { receiverId: receiver } = req.params
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

  getReceiverRequests = async (req, res) => {
    const requests = await friendRequestService.getReceiverRequests(req.user._id)
    res.status(200).json(new OK({
      message: 'Receiver friend requests retrieved successfully',
      metadata: requests
    }))
  }

  getSenderRequests = async (req, res) => {
    const requests = await friendRequestService.getSenderRequests(req.user._id)
    res.status(200).json(new OK({
      message: 'Sender friend requests retrieved successfully',
      metadata: requests
    }))
  }

  cancelFriendRequest = async (req, res) => {
    const { requestId } = req.params
    const request = await friendRequestService.cancelRequest(requestId, req.user._id)
    res.status(200).json(new OK({
      message: 'Friend request cancelled successfully',
      metadata: request
    }))
  }

  unFriend = async (req, res) => {
    const { friendId } = req.params
    const result = await friendRequestService.unFriend(req.user._id, friendId)

    res.status(200).json(new OK({
      message: 'Unfriended successfully',
      metadata: result
    }))
  }

  getListOfFriends = async (req, res) => {
    const friends = await friendRequestService.getFriendList(req.user._id)

    res.status(200).json(new OK({
      message: 'List of friends retrieved successfully',
      metadata: friends
    }))
  }
}

export default new FriendRequestController()