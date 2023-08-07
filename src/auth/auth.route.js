const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken'); // jwt 모듈을 추가했습니다.

const {
  RegisterController,
  LoginController,
} = require('../auth/auth.controller');
const RegisterInstance = new RegisterController();
const LoginInstance = new LoginController();

const router = express.Router();

router.post(
  '/register',
  RegisterInstance.registerUser,
  LoginInstance.loginUser
);
router.get(
  '/register/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/register/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    const user = req.user;

    //JWT 토큰 생성
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('lala', `Bearer ${token}`);

    return res.status(200).json({ message: '로그인 성공', token });
  }
);

router.get('/register/naver', passport.authenticate('naver')); // Naver로 변경
router.get(
  '/register/naver/callback',
  passport.authenticate('naver'),
  (req, res) => {
    const user = req.user;

    //JWT 토큰 생성
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('lala', `Bearer ${token}`);

    return res.status(200).json({ message: '로그인 성공', token });
  }
);

router.get('/register/kakao', passport.authenticate('kakao'));
router.get(
  '/register/kakao/callback',
  passport.authenticate('kakao', { failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user;

    //JWT 토큰 생성
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('lala', `Bearer ${token}`);

    return res.status(200).json({ message: '로그인 성공', token });
  }
);

module.exports = router;
