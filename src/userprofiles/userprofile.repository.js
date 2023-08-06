const { Posts, Users, Likes, sequelize, Sequelize } = require('../models');

class UserprofileRepository {
  // 유저가 작성한 게시글 가져오기
  userPosts = async (userId, loggedInUserId) => {
    const userPosts = await Posts.findAll({
      where: {
        userId,
        private: false, // public 게시글만 가져옵니다.
      },
      include: { model: Users, attributes: ['nickname', 'userImage'] },
    });

    // 프로필 주인인 경우, private 게시글도 가져옵니다.
    if (userId === loggedInUserId) {
      const privatePosts = await Posts.findAll({
        where: {
          userId,
          private: true,
        },
        include: { model: Users, attributes: ['nickname', 'userImage'] },
      });
      userPosts.push(...privatePosts);
    }
    return userPosts;
  };

  // 유저가 좋아요를 누른 게시글 가져오기
  userLikedPosts = async (userId) => {
    const likedPosts = await Posts.findAll({
      include: [
        {
          model: Likes,
          where: { userId },
        },
      ],
    });

    // private 게시글은 제외하여 필터링합니다.
    const filteredLikedPosts = likedPosts.filter((post) => !post.private);
    return filteredLikedPosts;
  };
}

module.exports = UserprofileRepository;
