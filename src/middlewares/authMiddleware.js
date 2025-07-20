import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import { AuthFailureError, NotFoundError } from '../handler/error-response.js'

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthFailureError('Authorization header is missing or invalid', 401))
  }

  const token = authHeader.split(' ')[1]
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
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null
    return next()
  }

  const token = authHeader.split(' ')[1]
  let decoded

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    req.user = null
    return next()
  }

  try {
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      req.user = null
    } else {
      req.user = user
    }
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
