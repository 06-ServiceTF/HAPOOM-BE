const PostRepository = require('./post.repository');
const jwt = require("jsonwebtoken");
const {Users,Posts,Records,Images} = require("../models");
const postRepository = new PostRepository();
const dotenv = require("dotenv");
dotenv.config();

class PostService {
  constructor() {
  }

  getPost = async (postId) => {
    return await postRepository.getPostById(postId);
  };

  getMainPost = async () => {
    return await postRepository.findLatestPost();
  };

  updatePost = async (postId, body, files, host) => {
    await postRepository.updatePost(postId, body, files, host);
  };

  deletePost = async (postId) => {
    await postRepository.deletePost(postId);
  };

  createPost = async (body, files, host) => {
    await postRepository.createPost(body, files, host);
  };

}

module.exports = PostService;
