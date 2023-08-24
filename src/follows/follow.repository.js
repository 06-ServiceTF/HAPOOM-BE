const { Users, Follows } = require('../models');

class FollowRepository {
  // 팔로우
  follow = async (userId, email, method) => {
    const user = await Users.findOne({
      where: { email, method },
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

  // 언팔로우
  unfollow = async (userId, email, method) => {
    const user = await Users.findOne({
      where: { email, method },
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

  // 유저 팔로워 리스트
  getFollowers = async (userId) => {
    const followers = await Follows.findAll({
      where: { followingId: userId },
      include: [{ model: Users, as: 'Follower' }],
    });
    return followers;
  };

  // 유저 팔로잉 리스트
  getFollowing = async (userId) => {
    const following = await Follows.findAll({
      where: { followerId: userId },
      include: [{ model: Users, as: 'Following' }],
    });
    return following;
  };

  // 나의 팔로워 리스트
  getMyFollowers = async (email, method) => {
    const user = await Users.findOne({
      where: { email, method },
      attributes: ['userId'],
    });
    const followers = await Follows.findAll({
      where: { followingId: user.userId },
      include: [{ model: Users, as: 'Follower' }],
    });
    return followers;
  };

  // 나의 팔로잉 리스트
  getMyFollowing = async (email, method) => {
    const user = await Users.findOne({
      where: { email, method },
      attributes: ['userId'],
    });
    const following = await Follows.findAll({
      where: { followerId: user.userId },
      include: [{ model: Users, as: 'Following' }],
    });
    return following;
  };
}

module.exports = FollowRepository;
