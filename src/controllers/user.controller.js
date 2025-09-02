// src/controllers/user.controller.js
import userService from '../services/user.service.js'
import { OK, CREATED } from '../handler/success-response.js'
import { AuthFailureError, NotFoundError } from '../handler/error-response.js'

class UserController {
  createUser = async (req, res) => {
    const user = await userService.createUser(req.body)
    res.status(201).json(new CREATED({
      message: 'User created successfully',
      metadata: user
    }))
  }

  getUser = async (req, res) => {
    const user = await userService.getUserById(req.params.id)
    if (!user) {
      return res.status(404).json(new NotFoundError('User not found'))
    }
    res.status(200).json(new OK({
      message: 'User retrieved successfully',
      metadata: user
    }))
  }

  getAllUsers = async (req, res) => {
    const users = await userService.getAllUsers()
    res.status(200).json(new OK({
      message: 'Users retrieved successfully',
      metadata: users
    }))
  }

  updateUser = async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body)
    if (!user) {
      return res.status(404).json(new NotFoundError('User not found'))
    }
    res.status(200).json(new OK({
      message: 'User updated successfully',
      metadata: user
    }))
  }

  deleteUser = async (req, res) => {
    const user = await userService.deleteUser(req.params.id)
    if (!user) {
      return res.status(404).json(new NotFoundError('User not found'))
    }
    res.status(200).json(new OK({
      message: 'User deleted successfully',
      metadata: null
    }))
  }

  getMe = async (req, res) => {
    if (!req.user) {
      return res.status(401).json(new AuthFailureError('Not authenticated'))
    }
    res.status(200).json(new OK({
      message: 'User retrieved successfully',
      metadata: req.user
    }))
  }

  updateMe = async (req, res) => {
    if (!req.user) {
      return res.status(401).json(new AuthFailureError('Not authenticated'))
    }
    const updatedUser = await userService.updateUser(req.user._id, req.body)
    res.status(200).json(new OK({
      message: 'Profile updated successfully',
      metadata: updatedUser
    }))
  }

  updateAvatar = async (req, res) => {
    if (!req.user) {
      return res.status(401).json(new AuthFailureError('Not authenticated'))
    }
    if (!req.file) {
      return res.status(400).json(new AuthFailureError('No file uploaded'))
    }
    const imgUrl = req.file.path
    const user = await userService.updateAvatar(req.user._id, imgUrl)
    res.status(200).json(new OK({
      message: 'Avatar updated successfully!',
      metadata: user
    }))
  }

  // Search users — giữ tên method là searchUsers để khớp router
  searchUsers = async (req, res) => {
    try {
      // chấp nhận nhiều param tên khác nhau từ front-end
      const raw = req.query.q ?? req.query.query ?? req.query.keyword ?? req.query.email ?? req.query.gmail ?? req.query.name ?? req.query.username
      const query = (raw || '').toString().trim()

      if (!query) {
        return res.status(400).json(new AuthFailureError('Query parameter is required'))
      }

      const currentUserId = req.user?._id || null
      const users = await userService.searchUsers(query, currentUserId)

      res.status(200).json(new OK({
        message: 'Users retrieved successfully',
        metadata: users
      }))
    } catch (error) {
      console.error('Search failed:', error)
      res.status(500).json(new AuthFailureError('Search failed'))
    }
  }
}

export default new UserController()