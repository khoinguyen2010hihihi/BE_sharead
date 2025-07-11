import postService from "../services/post.service.js"
import { OK, CREATED } from "../handler/success-response.js"

class PostController {
  createPost = async (req, res) => {
    const image = req.file?.path || ""
    const post = await postService.createPost({
      content: req.body.content,
      image,
      repostFrom: req.body.repostFrom || null,
      author: req.user._id,
    })

    res.status(201).json(
      new CREATED({
        message: "Post created successfully",
        metadata: post,
      })
    )
  }

  getAllPosts = async (req, res) => {
    const posts = await postService.getAllPosts()
    res.status(200).json(
      new OK({
        message: "Fetched all posts",
        metadata: posts,
      })
    )
  }

  getPostById = async (req, res) => {
    const post = await postService.getPostById(req.params.id)
    res.status(200).json(
      new OK({
        message: "Post detail",
        metadata: post,
      })
    )
  }

  likePost = async (req, res) => {
    const { post, liked } = await postService.toggleLike(req.params.id, req.user._id)

    res.status(200).json(
      new OK({
        message: liked ? "Liked post" : "Unliked post",
        metadata: post,
      })
    )
  }

  repostPost = async (req, res) => {
    const caption = req.body.content || ""
    const repost = await postService.repostPost(
      req.params.id,
      req.user._id,
      caption
    )

    res.status(201).json(
      new CREATED({
        message: "Repost successful",
        metadata: repost,
      })
    )
  }
}

export default new PostController()
