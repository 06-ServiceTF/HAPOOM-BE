const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

require("./src/passports/google.passport");
require("./src/passports/naver.passport");
require("./src/passports/kakao.passport");
require("./src/passports/local.passport");

const authRouter = require("./src/auth/auth.route"); // 인증 라우터

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
 
 
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    },
  })
);
   
  
app.use(morgan("dev"));
app.use(express.json());

// express-session 의존, 뒤로
app.use(passport.initialize()); // req 객체에 passport 설정을 심는다.
app.use(passport.session()); // req.session 객체에 passport 정보를 저장한다.
// passport.session() 미들웨어는 express-session 미들웨어보다 뒤에 연결해야 한다.
// passport.session()이 실행되면, 세션쿠키 정보 바탕으로 passport의 deserializeUser 메서드가 실행된다.


app.get("/", (_, res) => {
  return res.send("TF6 Hello World!!");
});

app.use("/auth", authRouter);  // 이 부분이 추가되어야 합니다.

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
 