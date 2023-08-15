const express = require("express");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const PostsController = require('./post.controller');
const postsController = new PostsController();
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

const router = express.Router();

router.post('',upload,postsController.createPost);
router.get('/:postId', postsController.getPost);
router.put('/:postId', upload, postsController.updatePost);
router.delete('/:postId', postsController.deletePost);

module.exports = router;
