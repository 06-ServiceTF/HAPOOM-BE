const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const { multerMiddleware } = require('../middlewares/multer.middleware');
const ProfileController = require('./profile.controller');
const profileController = new ProfileController();

const upload = multerMiddleware.fields([
  { name: 'image', maxCount: 5 },
  { name: 'audio', maxCount: 1}
])

// 유저 정보 조회
router.get('/', authMiddleware, profileController.userInfo);

// 유저 정보 수정
router.put('/', authMiddleware, upload, profileController.updateUser);

// 마이페이지 조회
router.get('/myprofile', authMiddleware, profileController.myProfile);

// 유저페이지 조회
router.get('/profile/:userId', profileController.userProfile);

module.exports = router;