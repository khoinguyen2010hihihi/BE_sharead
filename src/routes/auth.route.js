import express from 'express'
import authController from '../controllers/auth.controller.js'
import asyncHandler from '../middlewares/asyncHandle.js'
import { registerValidator, loginValidator } from '../middlewares/validators/auth.validator.js'
import { handleValidation } from '../middlewares/validators/handleValidation.js'
import passport from 'passport'

const router = express.Router()

router.post('/register', registerValidator, handleValidation, asyncHandler(authController.register))
router.post('/login', loginValidator, handleValidation, asyncHandler(authController.login))
router.post('/refresh-token', asyncHandler(authController.refreshToken))
router.post('/logout', asyncHandler(authController.logout))
router.post('/send-otp', asyncHandler(authController.sendOtp))
router.post('/verify-otp', asyncHandler(authController.verifyOtp))
router.post('/reset-password', asyncHandler(authController.resetPassword))
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), asyncHandler(authController.oauthCallback))

export default router