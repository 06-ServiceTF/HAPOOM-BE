const PostService = require('./post.service')

class PostController {
  postService = new PostService()

  createPost = async (req, res, next) => {
    const { content, musicTitle, musicUrl, tag, latitude, longitude, placeName  } = req.body
    const { image1, image2, image3, image4, image5 } = req.files

    try {
      const createPost = await this.postService.createPost()

    } catch (err) {
      next(err)
    }
  };

  findPost = async (req, res, next) => {

  };

  updatePost = async (req, res, next) => {

  };

  deletePost = async (req, res, next) => {

  }


}


module.exports = PostController

