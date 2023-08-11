const jwt = require("jsonwebtoken");
const { Users } = require("../models");
require("dotenv").config();

module.exports = async (req, res, next)=> {
  const token = req.cookies.refreshToken
  if (!token) return res.status(501).send('Access denied. No token provided.');
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.user = decoded;
    const user = await Users.findOne({ where: { email: decoded.email } });

    // 찾은 사용자를 res.locals.user에 등록
    if (user) {
      res.locals.user = user;
      next();
    } else {
      res.status(404).send('User not found.');
    }

  } catch (ex) {
    res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true, sameSite: 'None', secure: true });
    res.status(503).send('리프레시 토큰이 만료되었습니다.');
  }
}
