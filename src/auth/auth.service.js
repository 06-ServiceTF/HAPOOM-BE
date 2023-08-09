const jwt = require('jsonwebtoken');
const UserRepository = require('./auth.repository');
const bcrypt = require('bcrypt');
const userRepository = new UserRepository();

class AuthService {
  constructor() {
  }
  async getUserToken(email) {
    const user = await userRepository.findByEmail(email);
    const userResponse = user.get({ plain: true });
    delete userResponse.password;
    return { email: userResponse.email, nickname: userResponse.nickname };
  }

  async refreshToken(email) {
    const payload = {
      email,
      exp: Math.floor(Date.now() / 1000) + (60 * 30),//30분
    };
    return jwt.sign(payload, process.env.JWT_SECRET);
  }

  async signup(body) {
    const exUser = await userRepository.findByEmail(body.email);
    if (exUser) {
      throw new Error("이미 사용중인 아이디입니다");
    }
    const hashedPassword = await bcrypt.hash(body.password, 12);
    console.log(body)
    const user = await userRepository.createUser(body.email,hashedPassword, body.nickname, '');
    const userResponse = user.get({ plain: true });
    delete userResponse.password;
    return userResponse;
  }

  async login(req, user) {
    return new Promise((resolve, reject) => {
      req.logIn(user, async (loginErr) => {
        if (loginErr) {
          reject(loginErr);
        }
        const payload = {
          email: user.email,
          exp: Math.floor(Date.now() / 1000) + (60 * 30),//30분
        };
        const refreshPayload = {
          email: user.email,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 1),
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET);
        req.res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'None', secure: true });
        const userResponse = user.get({ plain: true });
        delete userResponse.password;
        resolve({ userResponse, token });
      });
    });
  }
}

module.exports = AuthService;
