import commentLikeController from "../controllers/comment-like.controller.js"
import { Router } from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = Router()

router.post("/:commentId", authMiddleware, commentLikeController.toggleLike)

export default router