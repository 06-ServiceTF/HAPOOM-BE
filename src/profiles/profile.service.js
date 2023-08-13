const ProfileRepository = require('./profile.repository');
const CustomError = require('../middlewares/error.middleware');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class ProfileService {
  profileRepository = new ProfileRepository();

  userInfo = async (email) => {
    const user = await this.profileRepository.userInfo(email);
    return user;
  };

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

  userProfile = async (email, loggedInUserId) => {
    const findUser = await this.profileRepository.findUser(email);
    if (!findUser) throw new CustomError('유저를 찾을 수 없습니다.', 404);

    const postsCount = await this.profileRepository.postsCount(email);
    const likePostsCount = await this.profileRepository.likePostsCount(email);

    const findPosts = await this.profileRepository.userPosts(
      email,
      loggedInUserId
    );
    const userPosts = findPosts.map((post) => {
      return {
        postId: post.postId,
        email: post.email,
        nickname: post.User.nickname,
        private: post.private,
        tag: post.tag,
        updatedAt: post.updatedAt,
        image: post.Images[0].url,
      };
    });

    // const userLikedPosts = await this.userprofileRepository.userLikedPosts(email);

    const findLikedPosts = await this.profileRepository.userLikedPosts(email);
    const userLikedPosts = findLikedPosts.map((post) => {
      return {
        postId: post.postId,
        email: post.email,
        nickname: post.User.nickname,
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
      userPosts,
      userLikedPosts,
    };
  };
}

module.exports = ProfileService;
