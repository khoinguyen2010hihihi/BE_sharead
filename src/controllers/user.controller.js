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
      return res.status(404).json(new NotFoundError('User not found', 'Failed to retrieve user'))
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
      return res.status(404).json(new NotFoundError('User not found', 'Failed to update user'))
    }
    res.status(200).json(new OK({
      message: 'User updated successfully',
      metadata: user
    }))
  }

  deleteUser = async (req, res) => {
    const user = await userService.deleteUser(req.params.id)
    if (!user) {
      return res.status(404).json(new NotFoundError('User not found', 'Failed to delete user'))
    }
    res.status(200).json(new OK({
      message: 'User deleted successfully',
      metadata: null
    }))
  }

  getMe = async (req, res) => {
    const user = req.user

    res.status(200).json(new OK({
      message: 'User retrieved successfully',
      metadata: user
    }))
  }

  updateMe = async (req, res) => {
    const updatedUser = await userService.updateUser(req.user._id, req.body)

    if (!updatedUser) {
      return res.status(404).json(new NotFoundError('User not found', 'Failed to update user'))
    }

    res.status(200).json(new OK({
      message: 'Profile updated successfully',
      metadata: updatedUser
    }))
  }

  updateAvatar = async(req, res) => {
    if (!req.file) {
      return res.status(400).json(new AuthFailureError('No file uploaded', 'Failed to update avatar'))
    }

    const imgUrl = req.file.path
    const user = await userService.updateAvatar(req.user._id, imgUrl)

    res.status(200).json(new OK({
      message: 'Avatar updated successfully!',
      metadata: user
    }))
  }

  searchUsers = async (req, res) => {
    const query = req.query.query
    if (!query) {
      return res.status(400).json(new AuthFailureError('Query parameter is required', 'Failed to search users'))
    }

    const users = await userService.searchUsers(query)
    if (users.length === 0) {
      return res.status(404).json(new NotFoundError('No users found', 'Failed to search users'))
    }
    res.status(200).json(new OK({
      message: 'Users retrieved successfully',
      metadata: users
    }))
  }

  
}

export default new UserController()