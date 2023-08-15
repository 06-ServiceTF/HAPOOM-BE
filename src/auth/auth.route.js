const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken"); // jwt 모듈을 추가했습니다.

const AuthController = require("../auth/auth.controller");
const authController = new AuthController();
const authMiddleware = require('../middlewares/auth.middleware');
const reauthMiddleware = require('../middlewares/reauth.middleware');

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/token",authMiddleware, authController.getUserToken);
router.get("/refreshtoken",reauthMiddleware, authController.refreshToken);
router.get("/logout", authController.logout);
router.get('/kakao', authController.kakaoLogin);
router.get('/kakao/callback', authController.kakaoCallback);
router.get('/naver', authController.naverLogin);
router.get('/naver/callback', authController.naverCallback);
router.get("/google", authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

module.exports = router;