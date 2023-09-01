const express = require("express");
const { multerMiddleware } = require('../middlewares/multer.middleware')
const PostsController = require('./post.controller');
const router = express.Router();
const postsController = new PostsController();
const { isIPBlocked, limiter,postlimiter } = require('../middlewares/limiter.middleware');

const upload = multerMiddleware.fields([
  { name: 'image', maxCount: 5 },
  { name: 'audio', maxCount: 1}
]);

// // 미들웨어를 라우터의 시작 부분에서 적용
// router.use(isIPBlocked, limiter);

router.post('', upload, isIPBlocked, postlimiter,postsController.createPost);
router.get('/:postId',isIPBlocked, limiter, postsController.getPost);
router.put('/:postId', upload, postsController.updatePost);
router.delete('/:postId', postsController.deletePost);

module.exports = router;
