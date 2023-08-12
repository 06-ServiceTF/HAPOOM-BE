const ProfileRepository = require('./profile.repository');
const CustomError = require('../middlewares/error.middleware');
const bcrypt = require('bcrypt');

class ProfileService {
  profileRepository = new ProfileRepository();

  userInfo = async (userId) => {
    const user = await this.profileRepository.userInfo(userId);
    return user;
  };

  updateInfo = async (userId, updateData, imageUrl) => {
    const user = await this.profileRepository.userInfo(userId);

    if (!user) throw new Error('유저를 찾을 수 없습니다.', 404);

    if (imageUrl) {
      user.userImage = imageUrl;
    }

    const updates = Object.keys(updateData);
    for (const update of updates) {
      if (update === 'password') {
        const hashedPassword = await bcrypt.hash(updateData[update], 10);
        user[update] = hashedPassword;
      } else {
        user[update] = updateData[update];
      }
    }

    await user.save();
    return user;
  };

  userprofile = async (userId, loggedInUserId) => {
    const findUser = await this.profileRepository.findUser(userId);
    if (!findUser) throw new CustomError('유저를 찾을 수 없습니다.', 404);

    const postsCount = await this.profileRepository.postsCount(userId);
    const likePostsCount = await this.profileRepository.likePostsCount(userId);

    const findPosts = await this.profileRepository.userPosts(
      userId,
      loggedInUserId
    );
    const userPosts = findPosts.map((post) => {
      return {
        postId: post.postId,
        userId: post.userId,
        nickname: post.User.nickname,
        // content: post.content,
        // latitude: post.latitude,
        // longitude: post.longitude,
        private: post.private,
        tag: post.tag,
        // musicTitle: post.musicTitle,
        // musicUrl: post.musicUrl,
        // placeName: post.placeName,
        // createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        image: post.Images[0].url,
      };
    });

    // const userLikedPosts = await this.userprofileRepository.userLikedPosts(userId);

    const findLikedPosts = await this.profileRepository.userLikedPosts(userId);
    const userLikedPosts = findLikedPosts.map((post) => {
      return {
        postId: post.postId,
        userId: post.userId,
        nickname: post.User.nickname,
        // content: post.content,
        // latitude: post.latitude,
        // longitude: post.longitude,
        private: post.private,
        tag: post.tag,
        // musicTitle: post.musicTitle,
        // musicUrl: post.musicUrl,
        // placeName: post.placeName,
        // createdAt: post.createdAt,
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
