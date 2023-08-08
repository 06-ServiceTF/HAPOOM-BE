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
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    const user = req.user;

    //JWT 토큰 생성
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    res.cookie("lala", `Bearer ${token}`);

    return res.status(200).json({ message: "로그인 성공", token });
  }
);

router.get("/naver", passport.authenticate("naver")); // Naver로 변경
router.get(
  "/naver/callback",
  passport.authenticate("naver"),
  (req, res) => {
    const user = req.user;

    //JWT 토큰 생성
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    res.cookie("lala", `Bearer ${token}`);

    return res.status(200).json({ message: "로그인 성공", token });
  }
);

router.get("/kakao", passport.authenticate("kakao"));
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", { failureRedirect : "/login"}),
  (req, res) => {
    const user = req.user;

    //JWT 토큰 생성
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    res.cookie("lala", `Bearer ${token}`);

    return res.status(200).json({ message: "로그인 성공", token });
  }
);

module.exports = router;
