import CommentLike from "../models/comment-like.model.js"

class CommentLikeService {
  toggleLike = async (userId, commentId) => {
    const existingLike = await CommentLike.findOne({ user: userId, comment: commentId })

    if (existingLike) {
      await existingLike.deleteOne()
      return { message: 'Like removed' }
    } else {
      const newLike = new CommentLike({ comment: commentId, user: userId })
      await newLike.save()
      return { message: 'Like added' }
    }
  }

  countLikes = async (commentId) => {
    return await CommentLike.countDocuments({ comment: commentId })
  }

  isLikedByCurrentUser = async (commentId, userId) => {
    if (!userId) return false
    const like = await CommentLike.findOne({ comment: commentId, user: userId })
    return !!like
  }
}

export default new CommentLikeService()