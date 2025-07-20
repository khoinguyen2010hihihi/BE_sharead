import Like from "../models/like.model.js"
import Post from "../models/post.model.js"
import { NotFoundError } from "../handler/error-response.js"

export class LikeService {
  toggleLike = async (postId, userId) => {
    const post = await Post.findById(postId)
    if (!post) throw new NotFoundError('Post not found')

    const existingLike = await Like.findOne({ post: postId, user: userId })
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id })
      return { liked: false }
    } else {
      const newLike = new Like({ user: userId, post: postId })
      await newLike.save()
      return { liked: true }
    }
  }

  countLikes = async (postId) => {
    return await Like.countDocuments({ post: postId })
  }

  getUsersWhoLikedPost = async (postId) => {
    return await Like.find({ post: postId })
      .populate('user', 'username avatar')
      .lean()
  }

  post_isLikedByCurrentUser = async (postId, userId) => {
    if (!userId) return false
    const like = await Like.findOne({ post: postId, user: userId })
    return !!like
  }
}

export default new LikeService()