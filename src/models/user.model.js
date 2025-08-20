import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Email is invalid'],
  },
  password: {
    type: String, 
    required: true,
    minlength: 8,
  },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/deyu8aoef/image/upload/v1755708335/kyouyuu/pdzbqwywt7mciyrpd8yf.jpg',
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  }
}, {
  timestamps: true,
})

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', UserSchema)
export default User