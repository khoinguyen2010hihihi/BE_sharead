import express from "express"
import friendRequestController from "../controllers/friend-request.controller.js"
import asyncHandler from "../middlewares/asyncHandle.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post('/send/:receiverId', authMiddleware, asyncHandler(friendRequestController.sendFriendRequest))
router.post('/accept/:requestId', authMiddleware, asyncHandler(friendRequestController.acceptFriendRequest))
router.delete('/reject/:requestId', authMiddleware, asyncHandler(friendRequestController.rejectFriendRequest))
router.get('/receiver', authMiddleware, asyncHandler(friendRequestController.getReceiverRequests))
router.get('/sender', authMiddleware, asyncHandler(friendRequestController.getSenderRequests))
router.delete('/cancel/:requestId', authMiddleware, asyncHandler(friendRequestController.cancelFriendRequest))
router.delete('/unfriend/:friendId', authMiddleware, asyncHandler(friendRequestController.unFriend))
router.get('/friends', authMiddleware, asyncHandler(friendRequestController.getListOfFriends))
router.get('/status/:otherUserId', authMiddleware, asyncHandler(friendRequestController.getStatus))

export default router