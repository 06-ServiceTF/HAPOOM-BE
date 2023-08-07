// repositories/test.repository.js
const User = require('../models');

class TestRepository {
  findUserByEmail = async (email) => {
    return User.findOne({ where: { email } });
  };

  findUserByEmailWithoutPassword = async (email) => {
    return User.findOne({ where: { email }, attributes: { exclude: ['password'] } });
  };

  findAllUsers = async () => {
    return User.findAll();
  };

  createUser = async (userDetails) => {
    return User.create(userDetails);
  };

  updateUserNickname = async (email, nickname) => {
    const user = await this.findUserByEmail(email);
    user.nickname = nickname;
    await user.save();
    return user;
  };

  deleteUserByEmail = async (email) => {
    const user = await this.findUserByEmail(email);
    await user.destroy();
  };
}

module.exports = TestRepository;
