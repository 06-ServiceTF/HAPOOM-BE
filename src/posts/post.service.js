const PostRepository = require('./post.repository')
const ImageRepository = require('../images/image.repository')

class PostService {

  postRepository = new PostRepository()

  createPost = async() => {}

}

module.exports = PostService