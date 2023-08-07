const express = require('express');
const router = express.Router();
// const authMiddleware = require('../middlewares/auth.middleware');
const TestController = require('./test.controller');
const {multerS3Middleware} = require("../middlewares/multerS3.middleware");
const testController = new TestController();

// testUser
router.get('/auth/token',  testController.getUserToken);
router.get('/auth/refreshToken',  testController.refreshToken);
router.get('/:email',  testController.getUserByEmail);
router.get('/auth/users', testController.getAllUsers);
router.post('/auth/signup', testController.signup);
router.post("/auth/login", testController.login);
router.post("/logout", testController.logout);
router.patch('/:email/nickName',  testController.updateNickname);
router.delete('/:email',  testController.deleteUser);

// testPost
router.get('/main',testController.getMainData)
router.post('/post', multerS3Middleware.array('image', 5), testController.createPost);
router.get('/post/:postId', testController.getPost);
router.post('/post/:postId/like', testController.toggleLike);
router.post('/report/:postId', testController.toggleReport);
router.put('/post/:postId', multerS3Middleware.array('image', 5), testController.updatePost);
router.get('/youtube/search', testController.youtubeSearch);
router.get('/map/reversegeocode', testController.reverseGeocode);

module.exports = router;
