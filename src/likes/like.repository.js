const { Posts, Likes } = require('../models');
const { Op } = require('sequelize');

class LikeRepository {
  checkPostExists = async (postId) => {
    const postExists = await Posts.findOne({ where: { postId } });
    return postExists;
  };

  existLike = async (postId, email) => {
    const existLike = await Likes.findOne({
      where: {
        [Op.and]: [{ postId }, { email }],
      },
    });
    return existLike;
  };

  addLike = async (postId, email) => {
    const addLike = await Likes.create({ postId, email });
    return addLike;
  };

  removeLike = async (postId, email) => {
    const removeLike = await Likes.destroy({
      where: {
        [Op.and]: [{ postId }, { email }],
      },
    });
    return removeLike;
  };
}

module.exports = LikeRepository;
