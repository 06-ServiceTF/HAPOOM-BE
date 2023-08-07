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

const setJwtCookie = (req, res) => {
  const user = req.user;

  if (!user || !user.userId) {
    return res.status(401).json({ message: "로그인에 실패했습니다." });
  }

  const token= jwt.sign ({ userId: user.userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("skycookie", `Bearer ${token}`);

  return res.status(200).json({ message: "로그인 성공", token });
}

router.post("/register", RegisterInstance.registerUser);
router.post("/login", LoginInstance.loginUser);

router.get("/auth-failed", (req, res) => {
  res.status(401).json({ message: "로그인에 실패했습니다." })});;

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect : "/auth-failed"}), setJwtCookie);

router.get("/naver", passport.authenticate("naver"));
router.get("/naver/callback", passport.authenticate("naver", { failureRedirect : "/auth-failed"}), setJwtCookie);

router.get("/kakao", passport.authenticate("kakao"));
router.get("/kakao/callback", passport.authenticate("kakao", { failureRedirect : "/auth-failed"}), setJwtCookie);

module.exports = router;
