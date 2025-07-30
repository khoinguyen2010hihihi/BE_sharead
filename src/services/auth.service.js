import { ConflictRequestError, NotFoundError } from "../handler/error-response.js"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import mailer from '../config/mailer.config.js'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_ACCESS_EXPIRES = '1h'
const JWT_REFRESH_EXPIRES = '7d'

class AuthService {
  register = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
      throw new ConflictRequestError("User already exists with this email")
    }
    const user = new User(userData)
    await user.save()
    return this._createToken(user)
  }

  login = async (email, password) => {
    const user = await User.findOne({ email }).select("+password")
    if (!user || !(await user.comparePassword(password))) {
      throw new ConflictRequestError("Invalid email or password")
    }
    return this._createToken(user)
  }

  _createToken = (user) => {
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role
    }
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES })
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES })

    return {
      accessToken,
      refreshToken,
      expiresIn: JWT_ACCESS_EXPIRES,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio
      }
    }
  }

  refreshToken = async (token) => {
    try {
      const payload = jwt.verify(token, JWT_SECRET)
      const user = await User.findById(payload.id)
      if (!user) {
        throw new NotFoundError("User not found")
      }
      return this._createToken(user)
    } catch (error) {
      console.error("[ERROR] RefreshToken failed:", error.message)
      throw new ConflictRequestError("Invalid refresh token")
    }
  }

  logout = async (userId) => {
    return { message: "User logged out successfully" }
  }

  sendOtp = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpire = Date.now() + 10 * 60 * 1000
    
    const user = await User.findOneAndUpdate(
      { email },
      {
        otpCode: otp,
        otpExpire: otpExpire
      },
      { new: true }
    )
    if (!user) {
      throw new NotFoundError("User not found with this email")
    }

    await mailer.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`
    })

    return { message: "OTP sent to email", otpExpire }
  }

  verifyOtp = async (email, otp) => {
    const user = await User.findOne({ email })
    if (!user) {
      throw new NotFoundError("User not found")
    }
    if (Date.now() > user.otpExpire) {
      throw new ConflictRequestError("OTP expired")
    }
    if (user.otpCode !== otp.toString()) {
      console.error("[ERROR] Invalid OTP:", otp, "for user otp:", user.otpCode)
      throw new ConflictRequestError("Invalid OTP")
    }
    user.otpCode = undefined
    user.otpExpire = undefined
    await user.save()
    return { message: "OTP verified successfully" }
  }

  resetPassword = async (email, newPassword) => {
    const user = await User.findOne({ email })
    if (!user) {
      throw new NotFoundError("User not found")
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()
    return { message: "Password reset successfully" }
  }
}

export default new AuthService()