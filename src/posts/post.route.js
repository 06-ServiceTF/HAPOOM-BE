const express = require("express");
const { multerMiddleware } = require('../middlewares/multer.middleware')
const PostsController = require('./post.controller');
const router = express.Router();
const postsController = new PostsController();

const upload = multerMiddleware.fields([
  { name: 'image', maxCount: 5 },
  { name: 'audio', maxCount: 1}
])

router.post('', upload, postsController.createPost);
router.get('/:postId', postsController.getPost);
router.put('/:postId', upload, postsController.updatePost);
router.delete('/:postId', postsController.deletePost);

module.exports = router;
