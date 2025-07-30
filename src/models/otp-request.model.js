import mongoose from "mongoose"

const OtpRequestSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  otpCode: {
    type: String,
    required: true,
  },
  otpExpire: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['forgot_password', 'verify_email'],
    default: 'forgot_password',
    required: true,
  }
}, {
  timestamps: true,
})

export default mongoose.model("OtpRequest", OtpRequestSchema)