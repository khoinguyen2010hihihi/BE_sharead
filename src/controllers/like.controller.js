import likeService from "../services/like.service.js"
import { OK } from "../handler/success-response.js"

class LikeController {
  toggleLike = async (req, res) => {
    const { liked } = await likeService.toggleLike(req.params.postId, req.user.id)
    res.status(200).json(new OK({
      message: liked ? 'Post liked' : 'Post unliked',
      metadata: { liked }
    }))
  }

  getPostLikes = async (req, res) => {
    const users = await likeService.getUsersWhoLikedPost(req.params.postId)
    res.status(200).json(new OK({
      message: 'Users who liked the post retrieved successfully',
      metadata: { users }
    }))
  }
}

export default new LikeController()