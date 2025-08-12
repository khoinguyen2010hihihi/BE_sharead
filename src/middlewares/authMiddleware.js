import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import { AuthFailureError, NotFoundError } from '../handler/error-response.js'

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken

  if (!token) {
    return next(new AuthFailureError('Authentication token is missing', 401))
  }

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return next(new AuthFailureError('Invalid or expired token', 401))
  }

  const user = await User.findById(decoded.id).select('-password')
  if (!user) {
    return next(new NotFoundError('User not found'))
  }

  req.user = user
  next()
}

export const optionalAuthMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken

  if (!token) {
    req.user = null
    return next()
  }

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    req.user = null
    return next()
  }

  try {
    const user = await User.findById(decoded.id).select('-password')
    req.user = user || null
  } catch (err) {
    return next(new AuthFailureError('Failed to retrieve user info'), 404)
  }

  next()
}

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AuthFailureError('Access denied: Admins only', 403))
  }
  next()
}
