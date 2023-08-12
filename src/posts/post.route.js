const express = require('express');
const router = express.Router();
const { multerMiddleware } = require('../middlewares/multer.middleware');
// 여기다 사용자 인증 미들웨어를 추가
const authMiddleware = require('../middlewares/auth.middleware');
const PostController = require('./post.controller');
const postController = new PostController();

// 게시글 생성
router.post(
  '/',
  authMiddleware,
  multerMiddleware.array('image'),
  postController.createPostImage
);

// 게시글 조회
router.get('/:postId', authMiddleware, postController.readPost);

// 게시글 수정
router.put(
  '/:postId',
  authMiddleware,
  multerMiddleware.array('image'),
  postController.updatePostImage
);

// 게시글 삭제
router.delete('/:postId', authMiddleware, postController.deletePostImage);

module.exports = router;
