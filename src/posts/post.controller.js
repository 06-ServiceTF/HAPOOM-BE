// controllers/postsController.js

const PostService = require('./post.service');
const jwt = require("jsonwebtoken");
const {Users} = require("../models");
const dotenv = require("dotenv");
dotenv.config();
const postService = new PostService();

class PostController {
  constructor() {
  }

  createPost = async (req, res) => {
    try {
      const token = req.cookies.refreshToken;
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await Users.findOne({ where: { email: decoded.email } });
      const host = req.protocol + '://' + req.get('host');
      await postService.createPost(user.userId,req.body, req.files, host);
      res.status(200).send({message: 'Post create Success'});
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message });
    }
  };

  getPost = async (req, res) => {
    try {
      const result = await postService.getPost(req.params.postId);
      res.send(result);
    } catch (error) {
      res.status(error.status || 500).send({error: error.message});
    }
  };

  updatePost = async (req, res) => {
    try {
      const host = req.protocol + '://' + req.get('host');
      await postService.updatePost(req.params.postId, req.body, req.files, host);
      res.status(200).send({message: 'Post updated'});
    } catch (error) {
      res.status(error.status || 500).send({error: error.message});
    }
  };

  deletePost = async (req, res) => {
    try {
      await postService.deletePost(req.params.postId);
      res.status(200).send({message: 'Post and associated images deleted'});
    } catch (error) {
      res.status(error.status || 500).send({error: error.message});
    }
  };

}

module.exports = PostController
