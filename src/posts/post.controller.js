// controllers/postsController.js

const PostService = require('./post.service');
const jwt = require("jsonwebtoken");
const {Users} = require("../models");
const webpush = require("web-push");
const Subscription = require("../util/util.repository");

require('dotenv').config();

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  'mailto:sniperad@naver.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
const postService = new PostService();

class PostController {
  constructor() {
  }

  createPost = async (req, res) => {
    try {
      const token = req.cookies.refreshToken;
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await Users.findOne({ where: { email: decoded.email,method:decoded.method } });
      const host = req.protocol + '://' + req.get('host');
      await postService.createPost(user.userId,req.body, req.files, host);
      const io = req.app.get('io');
      io.emit('newPost', { message: '새 게시물이 등록 되었습니다.' });
      Subscription.findAllSub().then(subscriptions => {
        subscriptions.forEach(sub => {
          // 구독 상태를 체크 (예: sub.isActive 또는 어떤 플래그를 통해)
          if (sub.receive===true) {
            const pushConfig = {
              endpoint: sub.endpoint,
              keys: sub.keys,
            };
            // 구독 정보를 콘솔에 출력합니다.
            console.log('Subscription:', sub.toJSON());
            webpush.sendNotification(pushConfig, JSON.stringify({ title: '새글이 작성되었습니다!', content: '빨랑가서 확인해 봅시다.',url:process.env.ORIGIN }))
              .catch(error => console.error(error));
          }
        });
      });
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

  getMainPost = async () => {
    try {
      return await postService.getMainPost();
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
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
