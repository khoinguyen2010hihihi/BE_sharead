import Post from "../models/post.model.js"
import likeService from "./like.service.js"


export class PostService {
  createPost = async(postData) => {
    const post = new Post(postData)
    await post.save()
    return post
  }

  getPostById = async (postId, currentUserId) => {
    const post = await Post.findById(postId)
      .populate('author', 'username avatar')
      .populate('repostFrom')
      .lean()
    if (!post) throw new NotFoundError('Post not found')

    post.likeCount = await likeService.countLikes(postId)
    post.post_isLikedByCurrentUser = await likeService.post_isLikedByCurrentUser(postId, currentUserId)
    return post
  }

  getAllPosts = async (currentUserId) => {
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .populate('repostFrom')
      .sort({ createdAt: -1 })
      .lean()

    for (const post of posts) {
      post.likeCount = await likeService.countLikes(post._id)
      post.isLikedByCurrentUser = await likeService.isLikedByCurrentUser(post._id, currentUserId)
    }
    return posts
  }

  repostPost = async (postId, userId, caption = '') => {
    const post = await Post.findById(postId)
    if (!post) throw new NotFoundError('Post not found')
    
    const repost = new Post({
      content: caption,
      author: userId,
      repostFrom: postId
    })
    await repost.save()
    return repost
  }
}

export default new PostService()