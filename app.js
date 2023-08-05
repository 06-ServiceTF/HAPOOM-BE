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

app.listen(process.env.PORT || 3000, (req, res) => {
  console.log(`${process.env.PORT || 3000} 포트에 접속 되었습니다.`);
});
