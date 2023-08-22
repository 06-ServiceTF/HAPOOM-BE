const { Posts, Users, Images, Likes, Follows } = require('../models');

class ProfileRepository {
  // 유저 정보
  userInfo = async (email, method) => {
    const user = await Users.findOne({
      where: { email, method },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    return user;
  };

  // 유저 확인 (에러처리용)
  findUser = async (email, method) => {
    const user = await Users.findOne({ where: { email, method } });
    return user;
  };

  // 유저 정보 수정
  findByEmail = (email, method) => {
    return Users.findOne({ where: { email: email, method: method } });
  };
  save = (user) => {
    return user.save();
  };

  // 마이페이지 작성 게시글 수
  postsCount = async (email, method) => {
    const user = await Users.findOne({ where: { email, method } });
    const postsCount = await Posts.count({
      where: { userId: user.userId },
    });
    return postsCount;
  };

  // 마이페이지 좋아요 누른 게시글 수
  likePostsCount = async (email, method) => {
    const user = await Users.findOne({ where: { email, method } });
    const likePostsCount = await Likes.count({
      where: { userId: user.userId },
    });
    return likePostsCount;
  };

  // 마이페이지 팔로워 수 계산
  myFollowerCount = async (email, method) => {
    const user = await Users.findOne({ where: { email, method } });
    const followerCount = await Follows.count({
      where: { followingId: user.userId },
    });
    return followerCount;
  };

  // 마이페이지 팔로잉 수 계산
  myFollowingCount = async (email, method) => {
    const user = await Users.findOne({ where: { email, method } });
    const followingCount = await Follows.count({
      where: { followerId: user.userId },
    });
    return followingCount;
  };

  // 마이페이지 게시글 조회
  myPosts = async (email, method, page) => {
    const user = await Users.findOne({ where: { email, method } });
    const limit = 12;
    const offset = (page - 1) * limit;
    const myPosts = await Posts.findAll({
      where: { userId: user.userId },
      include: [{ model: Images, attributes: ['url'], limit: 1 }],
      limit,
      offset,
    });
    return myPosts;
  };

  // 마이페이지 좋아요 게시글 조회
  myLikedPosts = async (email, method, page) => {
    const user = await Users.findOne({ where: { email, method } });
    const limit = 12;
    const offset = (page - 1) * limit;
    const likePostIds = await Likes.findAll({
      where: { userId: user.userId },
      attributes: ['postId'],
      limit,
      offset,
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
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
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

  // 유저페이지 팔로워 수 계산
  userFollowerCount = async (userId) => {
    const followerCount = await Follows.count({
      where: { followingId: userId },
    });
    return followerCount;
  };

  // 유저페이지 팔로잉 수 계산
  userFollowingCount = async (userId) => {
    const followingCount = await Follows.count({
      where: { followerId: userId },
    });
    return followingCount;
  };

  // 유저가 작성한 게시글 가져오기
  userPosts = async (userId, page) => {
    const limit = 12;
    const offset = (page - 1) * limit;
    const userPosts = await Posts.findAll({
      where: { userId, private: false },
      include: [
        { model: Users, attributes: ['nickname'] },
        { model: Images, attributes: ['url'], limit: 1 },
      ],
      limit,
      offset,
    });
    return userPosts;
  };

  // 유저가 좋아요를 누른 게시글 가져오기
  userLikedPosts = async (userId, page) => {
    const limit = 12;
    const offset = (page - 1) * limit;
    const likedPosts = await Posts.findAll({
      where: { userId, private: false },
      include: [
        { model: Likes, where: { userId } },
        { model: Users, attributes: ['nickname'] },
        { model: Images, attributes: ['url'], limit: 1 },
      ],
      limit,
      offset,
    });
    return likedPosts;
  };
}

module.exports = ProfileRepository;
