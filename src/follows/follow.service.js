const FollowRepository = require('./follow.repository');
const CustomError = require('../middlewares/error.middleware');

class FollowService {
  followRepository = new FollowRepository();

  // 팔로우
  follow = async (userId, email, method) => {
    const follow = await this.followRepository.follow(userId, email, method);
    return follow;
  };

  // 언팔로우
  unfollow = async (userId, email, method) => {
    const unfollow = await this.followRepository.unfollow(
      userId,
      email,
      method
    );
    return unfollow;
  };

  // 유저 팔로워 리스트
  getFollowers = async (userId) => {
    const getFollowers = await this.followRepository.getFollowers(userId);
    const followers = getFollowers.map((follow) => {
      return {
        userId: follow.Follower.userId,
        email: follow.Follower.email,
        nickname: follow.Follower.nickname,
        userImage: follow.Follower.userImage,
        preset: follow.Follower.preset,
      };
    });
    return followers;
  };

  // 유저 팔로잉 리스트
  getFollowing = async (userId) => {
    const getFollowings = await this.followRepository.getFollowing(userId);
    const followings = getFollowings.map((follow) => {
      return {
        userId: follow.Following.userId,
        email: follow.Following.email,
        nickname: follow.Following.nickname,
        userImage: follow.Following.userImage,
        preset: follow.Following.preset,
      };
    });
    return followings;
  };
}

module.exports = FollowService;
