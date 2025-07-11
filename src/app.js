
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import instanceMongoDB from './config/db.config.js'
import { errorHandler } from './handler/error-handler.js'
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT


app.use(express.json())
app.use(cookieParser())

instanceMongoDB


app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/post', postRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})