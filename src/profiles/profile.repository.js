const { Posts, Users, Images, Likes } = require('../models');

class ProfileRepository {
  // 유저 정보 조회
  userInfo = async (email,method) => {
    const user = await Users.findOne({
      where: { email,method },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    return user;
  };

  // 유저 확인 (에러처리용)
  findUser = async (email) => {
    const user = await Users.findOne({ where: { email } });
    return user;
  };

  // 유저 정보 수정
  findByEmail = (email) => {
    return Users.findOne({ where: { email: email } });
  };
  save = (user) => {
    return user.save();
  };

  // 마이페이지 작성 게시글 수
  postsCount = async (email) => {
    const user = await Users.findOne({ where: { email } });
    const postsCount = await Posts.count({
      where: { userId: user.userId },
    });
    return postsCount;
  };

  // 마이페이지 좋아요 누른 게시글 수
  likePostsCount = async (email) => {
    const user = await Users.findOne({ where: { email } });
    const likePostsCount = await Likes.count({
      where: { userId: user.userId },
    });
    return likePostsCount;
  };

  // 마이페이지 게시글 조회
  myPosts = async (email) => {
    const user = await Users.findOne({ where: { email } });
    const myPosts = await Posts.findAll({
      where: { userId: user.userId },
      include: [{ model: Images, attributes: ['url'], limit: 1 }],
    });
    return myPosts;
  };

  // 마이페이지 좋아요 게시글 조회
  myLikedPosts = async (email) => {
    const user = await Users.findOne({ where: { email } });
    const likePostIds = await Likes.findAll({
      where: { userId: user.userId },
      attributes: ['postId'],
    });
    const myLikedPosts = await Posts.findAll({
      where: { postId: likePostIds.map((like) => like.postId) },
      include: [{ model: Images, attributes: ['url'], limit: 1 }],
    });
    return myLikedPosts;
  };

  // 유저프로필 유저 확인 (에러처리용)
  getUser = async (userId) => {
    const user = await Users.findOne({
      where: { userId },
      attributes: { exclude: ['userId','preset','password', 'createdAt', 'updatedAt'] },
    });
    return user;
  };

  // 유저페이지 작성 게시글 수
  userPostsCount = async (userId) => {
    const postsCount = await Posts.count({
      where: { userId },
    });
    return postsCount;
  };

  // 유저페이지 좋아요 누른 게시글 수
  userLikePostsCount = async (userId) => {
    const likePostsCount = await Likes.count({
      where: { userId },
    });
    return likePostsCount;
  };

  // 유저가 작성한 게시글 가져오기
  userPosts = async (userId) => {
    const userPosts = await Posts.findAll({
      where: { userId, private: false },
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
      where: { userId, private: false },
      include: [
        { model: Likes, where: { userId } },
        { model: Users, attributes: ['nickname'] },
        { model: Images, attributes: ['url'], limit: 1 },
      ],
    });
    return likedPosts;
  };
}

module.exports = ProfileRepository;
