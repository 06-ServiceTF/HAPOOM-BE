const jwt = require("jsonwebtoken");
const { Users } = require("../models");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const user = await Users.findOne({ where: { email: decoded.email,method:decoded.method } });

    // 찾은 사용자를 res.locals.user에 등록
    if (user) {
      res.locals.user = user;
      next();
    } else {
      res.status(404).send('User not found.');
    }
  } catch (ex) {
    res.status(502).send('Invalid token.');
  }
}