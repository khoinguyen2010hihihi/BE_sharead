import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"
import { CloudinaryStorage } from "multer-storage-cloudinary"

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'kyouyuu',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    transformation: [{ width: 1080, crop: 'limit' }]
  }
})

export default cloudinary