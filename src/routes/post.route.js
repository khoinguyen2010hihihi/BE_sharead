import express from 'express'
import postController from '../controllers/post.controller.js'
import asyncHandler from '../middlewares/asyncHandle.js'
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/authMiddleware.js'
import upload from '../middlewares/upload.middleware.js'
import { createPostValidator } from '../middlewares/validators/post.validator.js'
import { handleValidation } from '../middlewares/validators/handleValidation.js'

const router = express.Router()

router.post('/', authMiddleware, createPostValidator, handleValidation, upload.single('image'), asyncHandler(postController.createPost))
router.get('/', optionalAuthMiddleware, asyncHandler(postController.getAllPosts))
router.get('/:id', optionalAuthMiddleware, asyncHandler(postController.getPostById))
router.post('/:id/repost', authMiddleware, asyncHandler(postController.repostPost))
router.get('/user/:id', optionalAuthMiddleware, asyncHandler(postController.getPostsByUserId))

export default router