const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const rateLimit = require("express-rate-limit");

const routes = require('./src/routes/index.route');
const testRouter = require('./src/test/test.route');
const initializeLocalPassport = require('./src/passports/local.passport');
const initializeGooglePassport = require('./src/passports/google.passport');
const initializeKakaoPassport = require('./src/passports/kakao.passport');
const initializeNaverPassport = require('./src/passports/naver.passport');

const path = require('path'); // 경로는 해당 모듈의 위치에 따라 달라집니다.

const http = require('http');
const socketIo = require('socket.io');
const PostsController = require("./src/posts/post.controller");
const webpush = require("web-push");
const Subscription = require("./src/util/util.repository");

require('dotenv').config();

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  'mailto:sniperad@naver.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const app = express();

// // 차단된 IP 주소를 저장할 배열
// const blockedIPs = [];
//
// // IP 차단 확인 미들웨어
// const isIPBlocked = (req, res, next) => {
//   if (blockedIPs.includes(req.ip)) {
//     return res.status(403).send("Your IP is permanently blocked.");
//   }
//   next();
// };
//
// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1분
//   max: 20, // 1분 안에 10번 요청
//   handler: function (req, res) {
//     const ip = req.ip;
//     if (!blockedIPs.includes(ip)) {
//       blockedIPs.push(ip);
//     }
//     res.status(429).send("Your IP has been permanently blocked due to excessive requests.");
//   },
// });
//
// app.use(isIPBlocked); // IP 차단 확인 미들웨어 추가
// app.use(limiter);     // 요청 제한 미들웨어 추가

const server = http.createServer(app);
const io = socketIo(server,{
  cors:{
    origin:['http://localhost:3000','http://localhost:3001','https://hapoom-fe.vercel.app','https://hapoom.life']
  }
});
app.set('io', io);
const origin = process.env.ORIGIN

const postController = new PostsController();

io.on('connection', async (socket) => {
  console.log('New client connected');
  try {
    const latestPosts = await postController.getMainPost();
    socket.emit('latest-posts', latestPosts); // 새로 연결된 클라이언트에게만 데이터 전송
  } catch (error) {
    console.error("Error fetching posts:", error);
    // 필요하다면 클라이언트에게 에러 상황을 알릴 수 있습니다.
    socket.emit('error-message', 'Error fetching posts.');
  }
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use(cors({
  origin:['http://localhost:3000','http://localhost:3001','https://hapoom.life'],
  credentials:true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}))

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    },
  })
);

app.use('/publicMusic', express.static('publicMusic'));

app.use('/', express.static(path.join(__dirname, 'publicMusic')));
app.use('/uploads', express.static('uploads'));
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use('/server', routes)
app.use('/api', routes);
app.use('/test', testRouter)


//에러 핸들러
app.use((err, req, res, next) => {
  const errorMessage = err.stack;
  console.error('errorMessage:', errorMessage);
  return res.status(err.status || 400).json({
    errorMessage: err.message || '오류가 발생했습니다',
  });
});
initializeLocalPassport(passport);
initializeGooglePassport(passport);
initializeKakaoPassport(passport);
initializeNaverPassport(passport);

// express-session 의존, 뒤로
app.use(passport.initialize()); // req 객체에 passport 설정을 심는다.
app.use(passport.session()); // req.session 객체에 passport 정보를 저장한다.
// passport.session() 미들웨어는 express-session 미들웨어보다 뒤에 연결해야 한다.
// passport.session()이 실행되면, 세션쿠키 정보 바탕으로 passport의 deserializeUser 메서드가 실행된다.


server.listen(process.env.PORT || 3001, (req, res) => {
  console.log(`http://localhost:${process.env.PORT}`);
});
