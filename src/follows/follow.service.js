const FollowRepository = require('./follow.repository');
const CustomError = require('../middlewares/error.middleware');

class FollowService {
  followRepository = new FollowRepository();

  follow = async (userId, email) => {
    const follow = await this.followRepository.follow(userId, email);
    return follow;
  };

  unfollow = async (userId, email) => {
    const unfollow = await this.followRepository.unfollow(userId, email);
    return unfollow;
  };

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
