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

function generateRandomPassword(length = 12) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

let tempStorage={};

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
    console.log(body);
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

  async social(req,res,body) {
    let user
    console.log(body.method)
    user = await userRepository.findByEmailandMethod({
      email: body.email,
      method: body.method,
    });
    if (!user) {
      const randomPassword = generateRandomPassword();

      // 생성된 랜덤 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(randomPassword, 12);
      user = await userRepository.createSocialUser(
        body.email,
        hashedPassword,
        body.nickname,
        '',
        body.method
      );
    }

    const io = req.app.get('io');
    io.emit('loginSuccess', {
      email: user.dataValues.email,
      nickname: user.dataValues.nickname,
    });

    const Payload = {
      email: user.dataValues.email,
      method: user.dataValues.method,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 1 * 1, // Access token valid for 1 Hour
    };

    const refreshPayload = {
      email: user.dataValues.email,
      method: user.dataValues.method,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1, // Refresh token valid for 1 days
    };


    const token = jwt.sign(
      Payload,
      process.env.JWT_SECRET
    );

    const refreshToken = jwt.sign(
      refreshPayload,
      process.env.JWT_REFRESH_SECRET
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    return {token};
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
        const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET);
        const tempId = crypto.randomBytes(16).toString('hex');
        tempStorage[tempId] = refreshToken;
        res.redirect(`https://hapoom.life/auth/SocialSuccess?tempId=${tempId}`);
      } catch (error) {
        console.log(error);
        return res.redirect(`https://hapoom.life/auth/SignIn`);
      }
    })(req, res, next);
  };

  async socialToken(req, res) {
      const tempId = req.query.tempId;
      if (!tempId || !tempStorage[tempId]) {
        return res.status(400).send('Invalid Temp ID');
      }
      const token = tempStorage[tempId];
      delete tempStorage[tempId];
      res.json({ token });
  }

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
          sameSite: 'None',
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
