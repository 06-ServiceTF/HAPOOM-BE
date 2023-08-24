const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = './uploads/';

// 디렉토리가 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // 업로드할 디렉토리 설정
  },
  filename: function (req, file, cb) {
    const now = new Date().toISOString();
    const date = now.replace(/:/g, '-'); // ':' 문자를 '-' 문자로 대체
    cb(null, date + file.originalname); // 저장될 파일명 설정
  }
});

const upload = multer({storage: storage}).fields([
  { name: 'image', maxCount: 5 },
  { name: 'audio', maxCount: 1 },
]);

const authMiddleware = require('../middlewares/auth.middleware')
const CommentController = require('./comment.controller');
const commentController = new CommentController();

// 댓글 생성
router.post('/:postId/comment', authMiddleware, upload,commentController.createComment);
// 게시글의 댓글 전체 조회
router.get('/:postId/comment', commentController.getComments);
// 댓글 수정
router.put('/:postId/comment/:commentId', authMiddleware, upload,commentController.updateComment);
// 댓글 삭제
router.delete('/:postId/comment/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;