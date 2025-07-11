import Post from "../models/post.model.js"

export class PostService {
  createPost = async(postData) => {
    const post = new Post(postData)
    await post.save()
    return post
  }

  getPostById = async (postId) => {
    const post = await Post.findById(postId)
      .populate('author', 'username avatar')
      .populate('repostFrom')
    if (!post) throw new NotFoundError('Post not found')
    return post
  }

  getAllPosts = async () => {
    return await Post.find()
      .populate("author", "username avatar")
      .populate("repostFrom")
      .sort({ createdAt: -1 })
      .lean()
  }

  toggleLike = async (postId, userId) => {
    const post = await Post.findById(postId)
    if (!post) throw new NotFoundError('Post not found')

    const hasLiked = post.likes.includes(userId)
    if (hasLiked) {
      post.likes.pull(userId)
    } else {
      post.likes.push(userId)
    }
    await post.save()
    return { post, liked: !hasLiked }
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