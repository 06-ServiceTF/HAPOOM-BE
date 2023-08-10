const express = require('express');
const router = express.Router();

// const authMiddleware = require('../middlewares/auth.middleware')
const LikeController = require("./like.controller");
const likeController = new LikeController();

// 좋아요 and 좋아요 취소
router.post("/:postId/like", likeController.clickLike);
// router.put("/:postId/like", authMiddleware, likeController.clickLike);

module.exports = router;
