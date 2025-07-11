import { CREATED, OK } from '../handler/success-response.js'
import commentService from '../services/comment.service.js'

class CommentController {
  createComment = async (req, res) => {
    const commentData = {
      content: req.body.content,
      post: req.params.postId,
      user: req.user._id
    }
    const comment = await commentService.createComment(commentData)
    res.status(201).json(new CREATED({
      message: 'Comment created successfully',
      metadata: comment
    }))
  }

  getCommentByPost = async (req, res) => {
    const comments = await commentService.getCommentByPost(req.params.postId)
    res.status(200).json(new OK({
      message: 'Comments retrieved successfully',
      metadata: comments
    }))
  }

  deleteComment = async (req, res) => {
    const commentId = req.params.commentId
    const userId = req.user._id
    const result = await commentService.deleteComment(commentId, userId)
    res.status(200).json(new OK({
      message: result.message,
      metadata: null
    }))
  }

  updateComment = async (req, res) => {
    const commentId = req.params.commentId
    const userId = req.user._id
    const content = req.body.content

    const updatedComment = await commentService.updateComment(commentId, userId, content)
    res.status(200).json(new OK({
      message: 'Comment updated successfully',
      metadata: updatedComment
    }))
  }
}

export default new CommentController()