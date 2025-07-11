import Comment from "../models/comment.model.js"

class CommentService {
  createComment = async (commentData) => {
    const comment = new Comment(commentData)
    await comment.save()
    return comment
  }

  getCommentByPost = async (postId) => {
    return await Comment.find({ post: postId }).populate('user', 'username avatar').sort({ createdAt: -1 }).lean()
  }

  deleteComment = async (commentId, userId) => {
    const comment = await Comment.findById(commentId)
    if (!comment) throw new Error('Comment not found')
    if (comment.user.toString() !== userId.toString()) throw new Error('Unauthorized')
    await comment.deleteOne()
    return { message: 'Comment deleted successfully' }
  }

  updateComment = async (commentId, userId, content) => {
    const comment = await Comment.findById(commentId)
    if (!comment) throw new Error('Comment not found')
    if (comment.user.toString() !== userId.toString()) throw new Error('Unauthorized')
    comment.content = content
    await comment.save()
    return comment
  }
}

export default new CommentService()