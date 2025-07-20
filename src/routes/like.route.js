import likeController from "../controllers/like.controller.js"
import { Router } from "express"
import { authMiddleware, optionalAuthMiddleware } from "../middlewares/authMiddleware.js"

const router = Router()

router.post("/:postId", authMiddleware, likeController.toggleLike)
router.get("/:postId", optionalAuthMiddleware, likeController.getPostLikes)

export default router