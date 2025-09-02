// src/services/user.service.js
import { ConflictRequestError, NotFoundError } from "../handler/error-response.js"
import User from "../models/user.model.js"

class UserService {
  // Tạo user mới
  createUser = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
      throw new ConflictRequestError("User already exists with this email")
    }
    const user = new User(userData)
    await user.save()
    return user
  }

  // Lấy user theo id
  getUserById = async (userId) => {
    return await User.findById(userId).select("-password -role")
  }

  // Update user (admin)
  updateUser = async (userId, updateData) => {
    delete updateData.role // Không cho update role từ client

    const existingUser = await User.findById(userId)
    if (!existingUser) {
      throw new NotFoundError("User not found")
    }

    // Nếu có password mới → gán lại
    if (updateData.password) {
      existingUser.password = updateData.password
    }

    // Update các field khác (giữ các field bạn đã dùng)
    existingUser.username = updateData.username || existingUser.username
    existingUser.email = updateData.email || existingUser.email
    existingUser.avatar = updateData.avatar || existingUser.avatar
    existingUser.bio = updateData.bio || existingUser.bio
    // Nếu model gốc có name/fullname, vẫn giữ việc gán (an toàn)
    if (typeof existingUser.name !== "undefined") {
      existingUser.name = updateData.name || existingUser.name
    }
    if (typeof existingUser.fullname !== "undefined") {
      existingUser.fullname = updateData.fullname || existingUser.fullname
    }

    await existingUser.save()
    return existingUser.toObject({ versionKey: false })
  }

  // Xóa user
  deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId)
  }

  // Lấy tất cả user (admin)
  getAllUsers = async () => {
    return await User.find().select("-password -role")
  }

  // Update avatar
  updateAvatar = async (userId, avatarUrl) => {
    return await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    ).select("-password -role")
  }

  // 🔎 Search user theo username hoặc email (không trả về chính mình)
  // - query: chuỗi tìm kiếm
  // - currentUserId: nếu có, sẽ loại id này khỏi kết quả
  searchUsers = async (query, currentUserId) => {
    // bảo đảm query an toàn cho regex (escape nếu cần)
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const searchRegex = new RegExp(escaped, "i")

    const andConds = [
      {
        $or: [
          { username: { $regex: searchRegex } },
          { email: { $regex: searchRegex } }
        ]
      }
    ]

    if (currentUserId) {
      andConds.push({ _id: { $ne: currentUserId } })
    }

    return await User.find({ $and: andConds }).select("-password -role")
  }
}

export default new UserService()