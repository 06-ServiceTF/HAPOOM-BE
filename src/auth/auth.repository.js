const { Users,Likes,Posts,Subscription } = require("../models");
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
      theme:1,
      preset:5,
      method:"direct"
    });

    return user;
  };

  createSocialUser = async (email, password, nickname, userImage, method) => {
    try {
      console.log(method)
      const user = await Users.create({
        email,
        password,
        nickname,
        userImage,
        theme: 1,
        preset: 5,
        method,
      });

      return user;
    } catch (error) {
      // 에러를 콘솔에 출력합니다.
      console.error('Error occurred while creating social user:', error);

      // 에러를 더 상위로 전파하거나, 다른 처리를 수행하려면 아래의 코드를 사용합니다.
      throw error;
    }
  };

  kakaoAuth = async (user, method) => {
    //console.log(user,method)
    let sequelizeUser = await Users.findOne({ where: { email: user._json.kakao_account.email,method } });
    if (!sequelizeUser) {
        sequelizeUser = await Users.create({
          email: user.email || user._json.kakao_account.email,
          nickname: user.nickname || user._json.properties.nickname,
          password: user.email || user._json.kakao_account.email,
          userImage: user._json.properties.thumbnail_image,
          method: method,
          theme: 1,
          preset: 1
        });
    }
      return sequelizeUser;
  };

  googleAuth = async (user, method) => {
    //console.log(user,method)
    let sequelizeUser = await Users.findOne({ where: { email: user.emails[0].value,method } });
    if (!sequelizeUser) {
        sequelizeUser = await Users.create({
          email: user.emails[0].value,
          nickname: user.displayName,
          password: user.emails[0].value,
          userImage: user._json.picture, // Google의 프로필 이미지를 가져올 수 있는 경로로 수정해야 합니다.
          method: method,
          theme: 1,
          preset: 1,
        });
    }
    return sequelizeUser;
  };

  naverAuth = async (user, method) => {
    //console.log(user,method)
    let sequelizeUser = await Users.findOne({ where: { email: user.emails[0].value,method } });
    if (!sequelizeUser) {
        sequelizeUser = await Users.create({
          email: user.emails[0].value,
          nickname: user.displayName,
          password: user.emails[0].value,
          userImage: user._json.profile_image, // Naver의 프로필 이미지를 가져올 수 있는 경로로 수정해야 합니다.
          method: method,
          theme: 1,
          preset: 1,
        });
    }
      return sequelizeUser;
  };

  async findByEmail(userData) {
    return Users.findOne({ where: { email:userData.email } });
  }

  async findByEmailandMethod(userData) {
    return Users.findOne({ where: { email:userData.email,method:userData.method } });
  }

  async findByEmailLikes(userData) {
    // 사용자 찾기
    const user = await Users.findOne({ where: { email: userData.email, method: userData.method } });

    if (!user) {
      throw new Error('User not found');
    }

    const sub = await Subscription.findOne({
      where: {
        userId: user.userId,
        receive: 1
      }
    });

    // 해당 사용자의 좋아요한 게시물 찾기
    const likes = await Likes.findAll({ where: { userId: user.userId } });

    // 좋아요한 게시물의 postId들을 배열로 반환
    const postIds = likes.map(like => like.postId);

    return {user,postIds,sub};
  }

}

module.exports = AuthRepository;