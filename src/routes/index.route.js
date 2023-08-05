const express = require('express');
const router = express.Router();

const mainRouter = require('../main/main.route')
const userprofileRouter = require('../userprofiles/userprofile.route')
const commentRouster = require('../comments/comment.route')

// 메인화면 관련
router.use('/main', mainRouter)
// 유저프로필 관련
router.use('/userprofile', userprofileRouter)
// 댓글 관련
router.use('/post', commentRouster)

module.exports = router;
