const express = require('express');
const router = express.Router();

const mainRouter = require('../main/main.route')
const userprofileRouter = require('../userprofiles/userprofile.route')
const commentRouter = require('../comments/comment.route')
const likeRouter = require('../likes/like.route')
const reportRouter = require('../models/reports')

// 메인화면 관련
router.use('/main', mainRouter)
// 유저프로필 관련
router.use('/userprofile', userprofileRouter)
// 댓글 관련
router.use('/post', commentRouter)
// 좋아요 관련
router.use('/post', likeRouter)
// 신고 관련
router.use('/post', reportRouter)

module.exports = router;
