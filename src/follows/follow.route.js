const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const FollowController = require('./follow.controller');
const followController = new FollowController();

// 팔로우
router.post('/:userId/follow', authMiddleware, followController.follow);
// 언팔로우
router.post('/:userId/unfollow', authMiddleware, followController.unfollow);
// 팔로우 리스트 가져오기
router.get('/:userId/follower', followController.getFollowers);
// 팔로잉 리스트 가져오기
router.get('/:userId/following', followController.getFollowing);

// 나의 팔로우 리스트 가져오기
router.get('/myfollower', followController.getMyFollowers);
// 나의 팔로잉 리스트 가져오기
router.get('/myfollowing', followController.getMyFollowing);

module.exports = router;
