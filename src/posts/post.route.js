const express = require("express");
const { multerMiddleware } = require('../middlewares/multer.middleware')
const PostsController = require('./post.controller');
const router = express.Router();
const postsController = new PostsController();
const { isIPBlocked, limiter, postlimiter } = require('../middlewares/limiter.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const upload = multerMiddleware.fields([
  { name: 'image', maxCount: 5 },
  { name: 'audio', maxCount: 1}
]);

router.post('', upload, isIPBlocked, postlimiter, authMiddleware, postsController.createPost);
router.get('/:postId',isIPBlocked, limiter, authMiddleware, postsController.getPost);
router.put('/:postId', upload, authMiddleware, postsController.updatePost);
router.delete('/:postId', authMiddleware, postsController.deletePost);

module.exports = router;
