const express = require('express');
const router = express.Router();
// const authMiddleware = require('../middlewares/auth.middleware');
const TestController = require('./test.controller');
const testController = new TestController();

// 신고하기
router.get('/auth/token',  testController.getUserToken);
router.get('/auth/refreshToken',  testController.refreshToken);
router.get('/:email',  testController.getUserByEmail);
router.get('/auth/users', testController.getAllUsers);
router.post('/auth/signup', testController.signup);
router.post("/auth/login", testController.login);
router.post("/logout", testController.logout);
router.patch('/:email/nickName',  testController.updateNickname);
router.delete('/:email',  testController.deleteUser);

module.exports = router;
