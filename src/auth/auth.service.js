const jwt = require('jsonwebtoken');
const UserRepository = require('./auth.repository');
const bcrypt = require('bcrypt');
const { Users } = require('../models');
const passport = require('passport');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
dotenv.config();
const userRepository = new UserRepository();

class AuthService {
  constructor() {}
  async getUserToken(userData) {
    const { user, postIds,sub } = await userRepository.findByEmailLikes(userData);
    const userResponse = user.get({ plain: true });
    delete userResponse.password;
    return {
      email: userResponse.email,
      nickname: userResponse.nickname,
      userImage: userResponse.userImage,
      preset: userResponse.preset,
      userId:userResponse.userId,
      likePosts: postIds,
      push: sub ? true : false,
    };
  }

  async refreshToken(user) {
    const payload = {
      email: user.email,
      method: user.method,
      exp: Math.floor(Date.now() / 1000) + 60 * 30, //30분
    };
    return jwt.sign(payload, process.env.JWT_SECRET);
  }

  async signup(body) {
    const exUser = await userRepository.findByEmail({
      email: body.email,
    });
    if (exUser) {
      throw new Error('이미 사용중인 아이디입니다');
    }
    const hashedPassword = await bcrypt.hash(body.password, 12);
    const user = await userRepository.createUser(
      body.email,
      hashedPassword,
      body.nickname,
      ''
    );
    const userResponse = user.get({ plain: true });
    delete userResponse.password;
    return userResponse;
  }

  async emailAuth(res, body) {
    const exUser = await userRepository.findByEmail(body.email);
    if (exUser) {
      throw new Error('이미 사용중인 이메일입니다');
    }

    console.log(process.env.SEND_EMAIL_ID, process.env.SEND_EMAIL_PW);
    const transporter = nodemailer.createTransport({
      service: 'Naver',
      auth: {
        user: process.env.SEND_EMAIL_ID,
        pass: process.env.SEND_EMAIL_PW,
      },
    });

    const mailOptions = {
      from: process.env.SEND_EMAIL_ID,
      to: body.email,
      subject: '하품 이메일인증 인증번호',
      text: '1111',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.status(200);
      }
    });
  }

  async passwordAuth(res, body) {
    const transporter = nodemailer.createTransport({
      service: 'Naver',
      auth: {
        user: process.env.SEND_EMAIL_ID,
        pass: process.env.SEND_EMAIL_PW,
      },
    });

    const temporaryPassword = crypto.randomBytes(8).toString('hex');
    const mailOptions = {
      from: process.env.SEND_EMAIL_ID,
      to: body.email,
      subject: '하품 이메일인증 인증번호',
      text: `임시 비밀번호: ${temporaryPassword}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.status(200);
      }
    });
  }

  socialLogin = async (req, res, next, method) => {
    passport.authenticate(method, async function (err, user, info) {
      if (err) return next(err);
      let sequelizeUser;
      try {
        if (method === 'kakao') {
          sequelizeUser = await userRepository.kakaoAuth(user, method);
        } else if (method === 'google') {
          sequelizeUser = await userRepository.googleAuth(user, method);
        } else if (method === 'naver') {
          sequelizeUser = await userRepository.naverAuth(user, method);
        }
        console.log(sequelizeUser);
        const refreshPayload = {
          email: sequelizeUser.dataValues.email,
          method,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1, // Refresh token valid for 1 days
        };

        const io = req.app.get('io');
        io.emit('loginSuccess', {
          email: sequelizeUser.dataValues.email,
          nickname: sequelizeUser.dataValues.nickname,
        });

        const refreshToken = jwt.sign(
          refreshPayload,
          process.env.JWT_REFRESH_SECRET
        );
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',

          secure: true,
        });
        return res.redirect(`${process.env.ORIGIN}/auth/SocialSuccess`);
      } catch (error) {
        console.log(error);
        return res.redirect(`${process.env.ORIGIN}/auth/SignIn`);
      }
    })(req, res, next);
  };

  async login(req, res, user) {
    return new Promise((resolve, reject) => {
      req.logIn(user, async (loginErr) => {
        if (loginErr) {
          reject(loginErr);
        }
        const payload = {
          email: user.email,
          method: user.method,
          exp: Math.floor(Date.now() / 1000) + 60 * 30, //30분
        };
        const refreshPayload = {
          email: user.email,
          method: user.method,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET);
        const refreshToken = jwt.sign(
          refreshPayload,
          process.env.JWT_REFRESH_SECRET
        );
        req.res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',

          secure: true,
        });
        const userResponse = user.get({ plain: true });
        delete userResponse.password;
        resolve({ userResponse, token });
      });
    });
  }
}

module.exports = AuthService;
