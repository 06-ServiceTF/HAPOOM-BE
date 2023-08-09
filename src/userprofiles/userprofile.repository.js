const {
  Posts,
  Users,
  Images,
  Likes,
  sequelize,
  Sequelize,
} = require('../models');

class UserprofileRepository {
  // 유저가 작성한 게시글 가져오기
  userPosts = async (userId, loggedInUserId) => {
    const userPosts = await Posts.findAll({
      where: {
        userId,
        private: false, // public 게시글만 가져오기
      },
      include: [
        { model: Users, attributes: ['nickname'] },
        { model: Images, attributes: ['url'], limit: 1 },
      ],
    });

    // 프로필 주인인 경우, private 게시글도 가져오기
    if (userId === loggedInUserId) {
      const privatePosts = await Posts.findAll({
        where: {
          userId,
          private: true,
        },
        include: [
          { model: Users, attributes: ['nickname'] },
          { model: Images, attributes: ['url'], limit: 1 },
        ],
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
        { model: Users, attributes: ['nickname'] },
        { model: Images, attributes: ['url'], limit: 1 },
      ],
    });

    // private(true) 게시글은 제외하여 필터링
    // likedPosts 배열을 순회 -> private = false인 경우만 filteredLikedPosts 배열에 남김
    // !post.private 부분은 private 값이 false인 경우 true를 반환, private 값이 true인 경우 false를 반환
    const filteredLikedPosts = likedPosts.filter((post) => !post.private);
    return filteredLikedPosts;
  };
}

module.exports = UserprofileRepository;
