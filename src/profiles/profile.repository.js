const {
  Posts,
  Users,
  Images,
  Likes,
  sequelize,
  Sequelize,
} = require('../models');

class ProfileRepository {
  userInfo = async (userId) => {
    const user = await Users.findOne({
      where: { userId },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    return user;
  };

  findUser = async (userId) => {
    const user = await Users.findOne({
      where: { userId },
      attributes: { exclude: ['preset', 'password', 'createdAt', 'updatedAt'] },
    });
    return user;
  };

  postsCount = async (userId) => {
    const postsCount = await Posts.count({
      where: { userId },
    });
    return postsCount;
  };

  likePostsCount = async (userId) => {
    const likePostsCount = await Likes.count({
      where: { userId },
    });
    return likePostsCount;
  };

  // 유저가 작성한 게시글 가져오기
  userPosts = async (userId, loggedInUserId) => {
    const whereCondition = {
      userId,
      private: loggedInUserId === userId ? [true, false] : false,
    };

    const userPosts = await Posts.findAll({
      where: whereCondition,
      include: [
        { model: Users, attributes: ['nickname'] },
        { model: Images, attributes: ['url'], limit: 1 },
      ],
    });
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

module.exports = ProfileRepository;
