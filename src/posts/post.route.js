const express = require('express')
const router = express.Router()
const PostController = require('./post.controller')
const postController = new PostController
const { multerS3Middleware } = require('../middlewares/multerS3.middleware')
// 사용자 미들웨어
const authMiddleware = require('../middlewares/auth.middleware')


// 게시글 작성
router.post('/', 
  authMiddleware,
  multerS3Middleware.fields([
    {name: 'image1'},
    {name: 'image2'},
    {name: 'image3'},
    {name: 'image4'},
    {name: 'image5'},
  ]),
  postController.createPostWithImage)

// 게시글 상세조회
router.get('/:postId', authMiddleware, postController.findPostWithImage)

// 게시글 수정
router.put('/:postId', authMiddleware, postController.updatePostWithImage)

// 게시글 삭제
router.delete('/:postId', authMiddleware, postController.deletePostWithImage)

module.exports = router