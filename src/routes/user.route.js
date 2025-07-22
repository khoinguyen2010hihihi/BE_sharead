import express from 'express'
import userController from '../controllers/user.controller.js'
import asyncHandler from '../middlewares/asyncHandle.js'
import { authMiddleware, isAdmin, optionalAuthMiddleware } from '../middlewares/authMiddleware.js'
import upload from '../middlewares/upload.middleware.js'

const router = express.Router()

router.post('/create', asyncHandler(userController.createUser))
router.put('/updateMe', authMiddleware, asyncHandler(userController.updateMe))
router.put('/updateAvatar', authMiddleware, upload.single('avatar'), asyncHandler(userController.updateAvatar))
router.get('/me', authMiddleware, asyncHandler(userController.getMe))
router.get('/getAll', optionalAuthMiddleware, asyncHandler(userController.getAllUsers))
router.get('/:id', optionalAuthMiddleware, asyncHandler(userController.getUser))
router.put('/:id', authMiddleware, isAdmin, asyncHandler(userController.updateUser))
router.delete('/:id', authMiddleware, isAdmin, asyncHandler(userController.deleteUser))


export default router