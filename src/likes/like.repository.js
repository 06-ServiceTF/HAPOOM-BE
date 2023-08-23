const { Posts, Likes, Users } = require('../models');
const { Op } = require('sequelize');

class LikeRepository {
  // 게시글 존재 여부 확인
  checkPostExists = async (postId) => {
    const postExists = await Posts.findOne({ where: { postId } });
    return postExists;
  };

  // 좋아요 상태 확인
  existLike = async (postId, email, method) => {
    const user = await Users.findOne({ where: { email, method } });
    if (!user) {
      return null;
    }
    const existLike = await Likes.findOne({
      where: {
        [Op.and]: [{ postId }, { userId: user.userId }],
      },
    });
    return existLike;
  };

  // 좋아요
  addLike = async (postId, email, method) => {
    const user = await Users.findOne({ where: { email, method } });
    if (!user) {
      return null;
    }
    const addLike = await Likes.create({ postId, userId: user.userId });
    return addLike;
  };

  // 좋아요 취소
  removeLike = async (postId, email, method) => {
    const user = await Users.findOne({ where: { email, method } });
    if (!user) {
      return null;
    }
    await Likes.destroy({
      where: {
        [Op.and]: [{ postId }, { userId: user.userId }],
      },
    });
  };
}

module.exports = LikeRepository;
