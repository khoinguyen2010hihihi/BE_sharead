import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import instanceMongoDB from './config/db.config.js'
import { errorHandler } from './handler/error-handler.js'
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'
import commentRouter from './routes/comment.route.js'
import likeRouter from './routes/like.route.js'
import commentLikeRouter from './routes/comment-like.route.js'
import friendRequestRouter from './routes/friend-request.route.js'
import passport from "./config/passport.config.js"
import cors from "cors"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 2010

app.use(express.json())
app.use(cookieParser())

instanceMongoDB

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true
}))

app.use(passport.initialize())
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/comment', commentRouter)
app.use('/like', likeRouter)
app.use('/comment-like', commentLikeRouter)
app.use('/friend', friendRequestRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})