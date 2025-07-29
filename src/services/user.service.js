import { ConflictRequestError, NotFoundError } from "../handler/error-response.js"
import User from "../models/user.model.js"

class UserService {
  async createUser(userData) {
    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
      throw new ConflictRequestError("User already exists with this email")
    }
    const user = new User(userData)
    await user.save()
    return user
  }

  async getUserById(userId) {
    return await User.findById(userId).select("-password").select("-role")
  }

  async updateUser(userId, updateData) {
    delete updateData.role

    if (updateData.password) {
      const existingUser = await User.findById(userId)
      if (!existingUser) {
        throw new NotFoundError("User not found")
      }
      existingUser.username = updateData.username || existingUser.username
      existingUser.email = updateData.email || existingUser.email
      existingUser.password = updateData.password || existingUser.password
      existingUser.avatar = updateData.avatar || existingUser.avatar
      existingUser.bio = updateData.bio || existingUser.bio
      await existingUser.save()
      return existingUser
    } else {
      return User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select("-password")
    }
  }

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId)
  }

  async getAllUsers() {
    return await User.find().select("-password")
  }

  async updateAvatar(userId, avatarUrl) {
    return await User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true }).select("-password")
  }

  async searchUsers(query) {
    return await User.find({
      username: {
        $regex: query,
        $options: 'i'
      }
    }).select("-password").select("-role")
  }

  getProfileByUsername = async (username) => {
    const 
  }
}

export default new UserService()