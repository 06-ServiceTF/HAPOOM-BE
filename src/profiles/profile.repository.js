const {
  Posts,
  Users,
  Images,
  Likes,
  sequelize,
  Sequelize,
} = require('../models');

class ProfileRepository {
  userInfo = async (email) => {
    const user = await Users.findOne({
      where: { email },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    return user;
  };

  findUser = async (email) => {
    const user = await Users.findOne({
      where: { email },
      attributes: { exclude: ['preset', 'password', 'createdAt', 'updatedAt'] },
    });
    return user;
  };

  postsCount = async (email) => {
    const postsCount = await Posts.count({
      where: { email },
    });
    return postsCount;
  };

  likePostsCount = async (email) => {
    const likePostsCount = await Likes.count({
      where: { email },
    });
    return likePostsCount;
  };

  // 유저가 작성한 게시글 가져오기
  userPosts = async (email, loggedInUserId) => {
    const whereCondition = {
      email,
      private: loggedInUserId === email ? [true, false] : false,
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
  userLikedPosts = async (email) => {
    const likedPosts = await Posts.findAll({
      include: [
        {
          model: Likes,
          where: { email },
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
