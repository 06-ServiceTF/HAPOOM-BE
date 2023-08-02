const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const indexRouter = require('./routes/index.routes');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
    return res.send("TF6 Hello World");
  });
  

app.use ("/api", indexRouter);

app.listen (PORT, () => {
    console.log(`http://localhost:${PORT}`);
});