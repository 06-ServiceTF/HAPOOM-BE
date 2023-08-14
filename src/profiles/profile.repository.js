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

  findByEmail = (email) => {
    return Users.findOne({ where: { email: email } });
  };
  save = (user) => {
    return user.save();
  };

  postsCount = async (email) => {
    const user = await Users.findOne({
      where: { email },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    const postsCount = await Posts.count({
      where: { userId: user.userId },
    });
    return postsCount;
  };

  likePostsCount = async (email) => {
    const user = await Users.findOne({
      where: { email },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    const likePostsCount = await Likes.count({
      where: { userId: user.userId },
    });
    return likePostsCount;
  };

  // 내가 작성한 게시글 가져오기
  myPosts = async (email) => {
    const user = await Users.findOne({
      where: { email },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    const myPosts = await Posts.findAll({
      where: { userId: user.userId },
      include: [{ model: Images, attributes: ['url'], limit: 1 }],
    });
    // console.log(myPosts)
    return myPosts;
  };

  // 내가 좋아요를 누른 게시글 가져오기
  myLikedPosts = async (email) => {
    const user = await Users.findOne({
      where: { email },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    const likePostIds = await Likes.findAll({
      where: { userId: user.userId },
      attributes: ['postId'],
    });
    const myLikedPosts = await Posts.findAll({
      where: { postId: likePostIds.map((lp) => lp.postId) },
      include: [{ model: Images, attributes: ['url'], limit: 1 }],
    });
    return myLikedPosts;
  };

  // // 유저가 작성한 게시글 가져오기
  // userPosts = async (email, loggedInUserId) => {
  //   const whereCondition = {
  //     email,
  //     private: loggedInUserId === email ? [true, false] : false,
  //   };

  //   const userPosts = await Posts.findAll({
  //     where: whereCondition,
  //     include: [
  //       { model: Users, attributes: ['nickname'] },
  //       { model: Images, attributes: ['url'], limit: 1 },
  //     ],
  //   });
  //   return userPosts;
  // };

  // // 유저가 좋아요를 누른 게시글 가져오기
  // userLikedPosts = async (email) => {
  //   const likedPosts = await Posts.findAll({
  //     include: [
  //       {
  //         model: Likes,
  //         where: { email },
  //       },
  //       { model: Users, attributes: ['nickname'] },
  //       { model: Images, attributes: ['url'], limit: 1 },
  //     ],
  //   });

  //   // private(true) 게시글은 제외하여 필터링
  //   // likedPosts 배열을 순회 -> private = false인 경우만 filteredLikedPosts 배열에 남김
  //   // !post.private 부분은 private 값이 false인 경우 true를 반환, private 값이 true인 경우 false를 반환
  //   const filteredLikedPosts = likedPosts.filter((post) => !post.private);
  //   return filteredLikedPosts;
  // };
}

module.exports = ProfileRepository;
