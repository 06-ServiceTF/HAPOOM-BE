const express = require('express');
const router = express.Router();

// const authMiddleware = require('../middlewares/auth.middleware')
const CommentController = require('./comment.controller');
const commentController = new CommentController();

// 댓글 생성
router.post('/:postId/comment', commentController.createComment);
// 게시글에 달린 댓글 조회
router.get('/:postId/comment', commentController.getComments);
// 댓글 수정
router.put('/:postId/comment/:commentId', commentController.updateComment);
// 댓글 삭제
router.delete('/:postId/comment/:commentId', commentController.deleteComment);

// // 댓글 생성
// router.post('/:postId/comment', authMiddleware, commentController.createComment);
// // 게시글에 달린 댓글 조회
// router.get('/:postId/comment', commentController.getComment);
// // 댓글 수정
// router.put('/:postId/comment/:commentId', authMiddleware, commentController.updateComment);
// // 댓글 삭제
// router.delete('/:postId/comment/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;
