const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware')
const CommentController = require('./comment.controller');
const commentController = new CommentController();

// 댓글 생성
router.post('/:postId/comment', authMiddleware, commentController.createComment);
// 게시글의 댓글 전체 조회
router.get('/:postId/comment', commentController.getComments);
// 댓글 수정
router.put('/:postId/comment/:commentId', authMiddleware, upload,commentController.updateComment);
// 댓글 삭제
router.delete('/:postId/comment/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;
