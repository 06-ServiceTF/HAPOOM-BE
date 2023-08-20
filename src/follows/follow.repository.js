const { Users, Relationships } = require('../models');

class FollowRepository {
  follow = async (email, method) => {
    const user = await Users.findOne({
      where: { email, method },
      attributes: ['userId'],
    });
    const follow = await Relationships.create({ userId: user.userId });
    return follow;
  };

  unfollow = async (email, method) => {
    const user = await Users.findOne({
      where: { email, method },
      attributes: ['userId'],
    });
    const unfollowed = await Relationships.destroy({
      where: { userId: user.userId },
    });
    return unfollowed;
  };

  getFollowers = async (userId) => {
    const followers = await Relationships.findAll({
      where: { userId },
      include: [{ model: Users, as: 'user' }],
    });
    return followers;
  };

  getFollowing = async (userId) => {
    const following = await Relationships.findAll({
      where: { followerId: userId },
      include: [{ model: Users, as: 'follower' }],
    });
    return following;
  };
}

module.exports = FollowRepository;
