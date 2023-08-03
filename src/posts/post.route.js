const express = require('express')
const router = express.Router()
const PostController = require('./post.controller')
const postController = new PostController
// 사용자 미들웨어
// const authMiddleware = require('../middlewares/auth.middleware')


// 게시글 작성_authMiddleware 적용 필요
router.post('/api/post', postController.createPost)

// 게시글 상세조회
router.get('/api/post:postId', postController.findPost)

// 게시글 수정_authMiddleware 적용 필요
router.put('api/post:postId', postController.updatePost)

// 게시글 삭제_authMiddleware 적용 필요
router.delete('/api/post/:postId', postController.deletePost)

module.exports = router