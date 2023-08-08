const { Users } = require("../models");
// const { ConflictError } = require("../errors/errors");

class AuthRepository {
  constructor() {
  }
  createUser = async (email, password,nickname, userImage) => {
    const existUserEmail = await Users.findOne({ where: { email } });
    if (existUserEmail) {
      throw new Error("이미 존재하는 이메일 입니다.");
    }

    const existUserNickname = await Users.findOne({ where: { nickname } });
    if (existUserNickname) {
      throw new Error("이미 존재하는 닉네임입니다.");
    }

    const user = await Users.create({
      email,
      password,
      nickname,
      userImage,
    });

    return user;
  };

  async findByEmail(email) {
    return Users.findOne({ where: { email } });
  }

}

module.exports = AuthRepository;