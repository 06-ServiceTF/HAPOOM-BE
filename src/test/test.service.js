// services/testService.js
const TestRepository = require('../test/test.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class TestService {
  constructor() {
    this.testRepository = new TestRepository();
  }

  findUserByEmail = async (email) => {
    const user = await this.testRepository.findUserByEmail(email);
    const userResponse = user.get({ plain: true });
    delete userResponse.password;
    return { email: userResponse.email, nickname: userResponse.nickname };
  };

  refreshToken = async (email) => {
    const payload = {
      email,
      exp: Math.floor(Date.now() / 1000) + (60 * 30),
    };
    return jwt.sign(payload, process.env.JWT_SECRET);
  };

  findUserByEmailWithoutPassword = async (email) => {
    return this.testRepository.findUserByEmailWithoutPassword(email);
  };

  findAllUsers = async () => {
    return this.testRepository.findAllUsers();
  };

  createUser = async (email, nickname, password) => {
    const exUser = await this.testRepository.findUserByEmail(email);
    if (exUser) {
      throw new Error("이미 사용중인 아이디입니다");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.testRepository.createUser({
      email,
      nickname,
      password: hashedPassword,
      method: 'direct',
    });
    const userResponse = user.get({ plain: true });
    delete userResponse.password;
    return { email: userResponse.email, nickname: userResponse.nickname };
  };

  updateNickname = async (email, nickname) => {
    return this.testRepository.updateUserNickname(email, nickname);
  };

  deleteUser = async (email) => {
    return this.testRepository.deleteUserByEmail(email);
  };
}

module.exports = TestService;
