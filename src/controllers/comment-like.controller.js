import commentLikeService from "../services/comment-like.service.js"
import { OK } from '../handler/success-response.js'

class CommentLikeController {
  toggleLike = async (req, res) => {
    const { liked } = await commentLikeService.toggleLike(req.params.commentId, req.user.id)
    res.status(200).json(new OK({
      message: liked ? 'Comment liked' : 'Comment unliked',
      metadata: { liked }
    }))
  }
}

export default new CommentLikeController()