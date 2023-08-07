const { Users } = require('../models');
const bcrypt = require('bcrypt'); 

class RegisterService {
  async registerUser(email, nickname, password) {
    try {
      // 같은 이메일을 가진 사용자
      const existingUser = await Users.findOne({ where: { email } });

      if (existingUser) {
        throw new Error('이미 존재하는 이메일입니다.');
      }
      const salt = bcrypt.genSaltSync(8);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await Users.create({ email, nickname, password: hashedPassword });

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async findUser(email) {
    try {
      // 사용자 찾기
      const user = await Users.findOne({ where: { email } });

      if (!user) {
        throw new Error('해당 이메일의 사용자를 찾을 수 없습니다.');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}

class LoginService {
}

module.exports = {
  RegisterService,
  LoginService,
};
