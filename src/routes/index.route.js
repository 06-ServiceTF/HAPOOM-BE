const express = require('express');
const router = express.Router();

const mainRouter = require('../main/main.route');
const userprofileRouter = require('../userprofiles/userprofile.route');
const commentRouter = require('../comments/comment.route');
const likeRouter = require('../likes/like.route');
const reportRouter = require('../reports/report.route');
const authRouter = require('../auth/auth.route');
const postRouter = require('../posts/post.route');

// 로그인 회원가입 관련
router.use('/auth', authRouter);
// 메인화면 관련
router.use('/main', mainRouter);
// 유저프로필 관련
router.use('/userprofile', userprofileRouter);
// 게시글, 댓글 관련
router.use('/post', [postRouter, commentRouter]);
// 좋아요 관련
router.use('/post', likeRouter);
// 신고 관련
router.use('/post', reportRouter);

module.exports = router;