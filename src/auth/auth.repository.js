const { Users } = require("../models");
// const { ConflictError } = require("../errors/errors");

class AuthRepository {
  registerUser = async (email, nickname, password, profileImgUrl) => {
    const existUserEmail = await Users.findOne({ where: { email } });
    if (existUserEmail) {
      throw new ConflictError("이미 존재하는 이메일 입니다.");
    }

    const existUserNickname = await Users.findOne({ where: { nickname } });
    if (existUserNickname) {
      throw new ConflictError("이미 존재하는 닉네임입니다.");
    }

    const user = await Users.create({
      email,
      nickname,
      password,
      profileImgUrl,
    });

    return user;
  };

  async findByEmail(email) {
    return Users.findOne({ where: { email } });
  }

}

module.exports = AuthRepository;
