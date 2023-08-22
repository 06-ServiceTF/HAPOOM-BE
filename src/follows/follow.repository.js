const { Users, Follows } = require('../models');

class FollowRepository {
  follow = async (userId, email) => {
    const user = await Users.findOne({
      where: { email },
      attributes: ['userId'],
    });

    const followerId = user.userId; // 팔로우 하는 사람의 ID
    const followingId = userId; // 팔로우 받는 사람의 ID

    if (followerId === parseInt(followingId)) {
      throw new Error('자기 자신을 팔로우할 수 없습니다.');
    }

    const existingFollow = await Follows.findOne({
      where: {
        followerId: followerId,
        followingId: parseInt(followingId),
      },
    });

    if (existingFollow) {
      throw new Error('이미 팔로잉 중.');
    }

    const follow = await Follows.create({
      followerId: followerId,
      followingId: parseInt(followingId),
    });

    return follow;
  };

  unfollow = async (userId, email) => {
    const user = await Users.findOne({
      where: { email },
      attributes: ['userId'],
    });

    const followerId = user.userId; // 언팔로우 하는 사람의 ID
    const followingId = userId; // 언팔로우 받는 사람의 ID

    const existingUnfollow = await Follows.findOne({
      where: {
        followerId: followerId,
        followingId: parseInt(followingId),
      },
    });

    if (!existingUnfollow) {
      throw new Error('팔로우하지 않음.');
    }

    const unfollow = await Follows.destroy({
      where: {
        followerId: followerId,
        followingId: followingId,
      },
    });

    return unfollow;
  };

  getFollowers = async (userId) => {
    const followers = await Follows.findAll({
      where: { followingId: userId },
      include: [
        {
          model: Users,
          as: 'Follower',
          // attributes: ['email', 'nickname', 'userImage'],
        },
      ],
    });

    return followers;
  };

  getFollowing = async (userId) => {
    const following = await Follows.findAll({
      where: { followerId: userId },
      include: [
        {
          model: Users,
          as: 'Following',
          // attributes: ['email', 'nickname', 'userImage'],
        },
      ],
    });

    return following;
  };
}

module.exports = FollowRepository;
