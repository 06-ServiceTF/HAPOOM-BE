const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

const routes = require('./src/routes/index.route');
const testRouter = require('./src/test/test.route');
const initializeLocalPassport = require('./src/passports/local.passport');
const path = require('path'); // 경로는 해당 모듈의 위치에 따라 달라집니다.
const http = require('http');
const socketIo = require('socket.io');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
  },
});
app.set('io', io);
const origin = process.env.ORIGIN;

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

const posts = [
  { title: 'Post 1', content: 'Content 1' },
  { title: 'Post 2', content: 'Content 2' },
  { title: 'Post 3', content: 'Content 3' },
];

// 모든 클라이언트에게 1분마다 랜덤 게시물 3개 전송
// setInterval(() => {
// const randomPosts = [];
// for (let i = 0; i < 3; i++) {
// const randomIndex = Math.floor(Math.random() * posts.length);
// randomPosts.push(posts[randomIndex]);
// }
// io.emit('random-posts', randomPosts);
// }, 12000);

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  })
);
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
app.use('/api', routes);
app.use('/test', testRouter);
//app.use("/auth", authRouter); // 이 부분이 추가되어야 합니다.

//에러 핸들러
app.use((err, req, res, next) => {
  const errorMessage = err.stack;
  console.error('errorMessage:', errorMessage);
  return res.status(err.status || 400).json({
    errorMessage: err.message || '오류가 발생했습니다',
  });
});
initializeLocalPassport(passport);
// express-session 의존, 뒤로
app.use(passport.initialize()); // req 객체에 passport 설정을 심는다.
app.use(passport.session()); // req.session 객체에 passport 정보를 저장한다.
// passport.session() 미들웨어는 express-session 미들웨어보다 뒤에 연결해야 한다.
// passport.session()이 실행되면, 세션쿠키 정보 바탕으로 passport의 deserializeUser 메서드가 실행된다.

server.listen(process.env.PORT || 3001, (req, res) => {
  console.log(`http://localhost:${process.env.PORT}`);
});
