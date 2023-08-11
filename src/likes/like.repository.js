const { Posts, Likes } = require('../models');
const { Op } = require('sequelize');

class LikeRepository {
  checkPostExists = async (postId) => {
    const postExists = await Posts.findOne({ where: { postId } });
    return postExists;
  };

  existLike = async (postId, userId) => {
    const existLike = await Likes.findOne({
      where: {
        [Op.and]: [{ postId }, { userId }],
      },
    });
    return existLike;
  };

  addLike = async (postId, userId) => {
    const addLike = await Likes.create({ postId, userId });
    return addLike;
  };

  removeLike = async (postId, userId) => {
    const removeLike = await Likes.destroy({
      where: {
        [Op.and]: [{ postId }, { userId }],
      },
    });
    return removeLike;
  };
}

module.exports = LikeRepository;
