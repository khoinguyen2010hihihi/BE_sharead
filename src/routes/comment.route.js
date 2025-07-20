import express from 'express'
import commentController from '../controllers/comment.controller.js'
import asyncHandler from '../middlewares/asyncHandle.js'
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/:postId', authMiddleware, asyncHandler(commentController.createComment))
router.get('/:postId', optionalAuthMiddleware, asyncHandler(commentController.getCommentByPost))
router.delete('/:commentId', authMiddleware, asyncHandler(commentController.deleteComment))
router.put('/:commentId', authMiddleware, asyncHandler(commentController.updateComment))

export default router