const ProfileRepository = require('./profile.repository');
const CustomError = require('../middlewares/error.middleware');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class ProfileService {
  profileRepository = new ProfileRepository();

  // 유저 정보 조회
  userInfo = async (email) => {
    const user = await this.profileRepository.userInfo(email);
    return user;
  };

  // 유저 정보 수정
  updateUser = async (token, file, body) => {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await this.profileRepository.findByEmail(decoded.email);
    if (!user) {
      throw new Error('User not found');
    }
    if (file) {
      user.userImage =
        file.protocol + '://' + file.get('host') + '/' + file.path;
    }
    const updates = Object.keys(body);
    for (const update of updates) {
      if (update === 'password') {
        user[update] = await bcrypt.hash(body[update], 10);
      } else {
        user[update] = body[update];
      }
    }
    await this.profileRepository.save(user);
    return user;
  };

  // 마이페이지 조회
  myProfile = async (email) => {
    const findUser = await this.profileRepository.findUser(email);
    if (!findUser) throw new CustomError('유저를 찾을 수 없습니다.', 404);

    const postsCount = await this.profileRepository.postsCount(email);
    const likePostsCount = await this.profileRepository.likePostsCount(email);

    const findPosts = await this.profileRepository.myPosts(email);
    const myPosts = findPosts.map((post) => {
      return {
        postId: post.postId,
        email: post.email,
        // nickname: post.User.nickname,
        private: post.private,
        tag: post.tag,
        updatedAt: post.updatedAt,
        image: post.Images[0].url,
      };
    });

    const findLikedPosts = await this.profileRepository.myLikedPosts(email);
    const myLikedPosts = findLikedPosts.map((post) => {
      return {
        postId: post.postId,
        email: post.email,
        // nickname: post.User.nickname,
        private: post.private,
        tag: post.tag,
        updatedAt: post.updatedAt,
        image: post.Images[0].url,
      };
    });

    return {
      findUser,
      postsCount,
      likePostsCount,
      myPosts,
      myLikedPosts
    };
  };

  // 유저페이지 조회
  userProfile = async (userId) => {
    const getUser = await this.profileRepository.getUser(userId);
    if (!getUser) throw new CustomError('유저를 찾을 수 없습니다.', 404);

    const userPostsCount = await this.profileRepository.userPostsCount(userId);
    const userLikePostsCount = await this.profileRepository.userLikePostsCount(userId);

    const findPosts = await this.profileRepository.userPosts(userId);
    const userPosts = findPosts.map((post) => {
      return {
        postId: post.postId,
        // nickname: post.User.nickname,
        private: post.private,
        tag: post.tag,
        updatedAt: post.updatedAt,
        image: post.Images[0].url,
      };
    });

    const findLikedPosts = await this.profileRepository.userLikedPosts(userId);
    const userLikedPosts = findLikedPosts.map((post) => {
      return {
        postId: post.postId,
        // nickname: post.User.nickname,
        private: post.private,
        tag: post.tag,
        updatedAt: post.updatedAt,
        image: post.Images[0].url,
      };
    });

    return {
      getUser,
      userPostsCount,
      userLikePostsCount,
      userPosts,
      userLikedPosts,
    };
  };
}

module.exports = ProfileService;
