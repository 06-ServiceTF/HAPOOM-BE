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
    const followers = await this.followRepository.getFollowers(userId);
    return followers;
  };

  getFollowing = async (userId) => {
    const following = await this.followRepository.getFollowing(userId);
    return following;
  };
}

module.exports = FollowService;
