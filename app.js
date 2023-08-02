const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const indexRouter = require('./routes/index.routes');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use ("/api", indexRouter);

app.listen (PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});