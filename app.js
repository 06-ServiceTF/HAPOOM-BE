const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

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
const server = http.createServer(app);
const io = socketIo(server,{
  cors:{
    origin:['http://localhost:3000','http://localhost:3001','https://hapoom-fe.vercel.app','https://hapoom.life']
  }
});
app.set('io', io);
const origin = process.env.ORIGIN

io.on('connection', (socket) => {
  console.log('New client connected');
  // 클라이언트에서 "post-created" 이벤트를 수신하면, 모든 클라이언트에게 알림을 보냅니다.
  socket.on('post-created', (data) => {
    io.emit('notify-post', { user: data.user, message: 'New post created!' });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

setInterval(async () => {
  const postController = new PostsController();
  const latestPosts = await postController.getMainPost();
  io.emit('latest-posts', latestPosts);
}, 60 * 1000); // 1분 간격

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
