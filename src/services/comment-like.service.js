import CommentLike from "../models/comment-like.model.js"
import Comment from "../models/comment.model.js"
import { NotFoundError } from "../handler/error-response.js"

class CommentLikeService {
  toggleLike = async (commentId, userId) => {
    const comment = await Comment.findById(commentId)
    if (!comment) throw new NotFoundError('Comment not found')

    const existingLike = await CommentLike.findOne({ comment: commentId, user: userId })
    if (existingLike) {
      await existingLike.deleteOne()
      return { liked: false }
    } else {
      const newLike = new CommentLike({ comment: commentId, user: userId })
      await newLike.save()
      return { liked: true }
    }
  }

  countLikes = async (commentId) => {
    return await CommentLike.countDocuments({ comment: commentId })
  }

  comment_isLikedByCurrentUser = async (commentId, userId) => {
    if (!userId) return false
    const like = await CommentLike.findOne({ comment: commentId, user: userId })
    return !!like
  }
}

export default new CommentLikeService()