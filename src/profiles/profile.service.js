const ProfileRepository = require('./profile.repository');
const CustomError = require('../middlewares/error.middleware');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class ProfileService {
  profileRepository = new ProfileRepository();
  // 유저 정보
  userInfo = async (email, method) => {
    const user = await this.profileRepository.userInfo(email, method);
    return user;
  };

  // 유저 정보 수정
  updateUser = async (token, file, body, host) => {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await this.profileRepository.findByEmail(
      decoded.email,
      decoded.method
    );
    if (!user) {
      throw new Error('User not found');
    }
    if (body.nickname && user.nickname !== body.nickname) {
      const existingUserWithNickname = await this.profileRepository.findUser(
        decoded.email,
        decoded.method,
        body.nickname
      );
      if (existingUserWithNickname) {
        throw new Error('Nickname already in use');
      }
    }
    if (file.image) {
      user.userImage = file.image[0].location;
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
  myProfile = async (email, method, page) => {
    const findUser = await this.profileRepository.findUser(email, method);
    if (!findUser) throw new CustomError('유저를 찾을 수 없습니다.', 404);

    const postsCount = await this.profileRepository.postsCount(email, method);
    const likePostsCount = await this.profileRepository.likePostsCount(
      email,
      method
    );
    const followerCount = await this.profileRepository.myFollowerCount(
      email,
      method
    );
    const followingCount = await this.profileRepository.myFollowingCount(
      email,
      method
    );

    const { posts, nextPage } = await this.profileRepository.myPosts(
      email,
      method,
      page
    );
    const myPosts = posts.map((post) => {
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

    const { likedPosts, nextLikedPage } =
      await this.profileRepository.myLikedPosts(email, method, page);
    const myLikedPosts = likedPosts.map((post) => {
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
      followerCount,
      followingCount,
      myPosts,
      nextPage,
      myLikedPosts,
      nextLikedPage,
    };
  };

  // 유저페이지 조회
  userProfile = async (userId, page) => {
    const getUser = await this.profileRepository.getUser(userId);
    if (!getUser) throw new CustomError('유저를 찾을 수 없습니다.', 404);

    const userPostsCount = await this.profileRepository.userPostsCount(userId);
    const userLikePostsCount = await this.profileRepository.userLikePostsCount(
      userId
    );
    const userFollowerCount = await this.profileRepository.userFollowerCount(
      userId
    );
    const userFollowingCount = await this.profileRepository.userFollowingCount(
      userId
    );

    const { posts, nextPage } = await this.profileRepository.userPosts(
      userId,
      page
    );
    const userPosts = posts.map((post) => {
      return {
        postId: post.postId,
        // nickname: post.User.nickname,
        private: post.private,
        tag: post.tag,
        updatedAt: post.updatedAt,
        image: post.Images[0].url,
      };
    });

    const { likedPosts, nextLikedPage } =
      await this.profileRepository.userLikedPosts(userId, page);
    const userLikedPosts = likedPosts.map((post) => {
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
      userFollowerCount,
      userFollowingCount,
      userPosts,
      nextPage,
      userLikedPosts,
      nextLikedPage,
    };
  };
}

module.exports = ProfileService;
