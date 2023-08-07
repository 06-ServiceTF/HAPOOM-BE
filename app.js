const express = require('express');
const cookieParser = require('cookie-parser');
// const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();

const routes = require('./src/routes/index.route');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api', routes);

//에러 핸들러
app.use((err, req, res, next) => {
  const errorMessage = err.stack;
  console.error('errorMessage:', errorMessage);
  return res.status(err.status || 400).json({
    errorMessage: err.message || '오류가 발생했습니다',
  });
});

app.listen(process.env.PORT || 3001, (req, res) => {
  console.log(`${process.env.PORT || 3001} 포트에 접속 되었습니다.`);
});
