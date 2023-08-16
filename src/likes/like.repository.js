const { Posts, Likes, Users } = require('../models');
const { Op } = require('sequelize');

class LikeRepository {
  checkPostExists = async (postId) => {
    const postExists = await Posts.findOne({ where: { postId } });
    return postExists;
  };

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

  addLike = async (postId, email, method) => {
    const user = await Users.findOne({ where: { email, method } });
    if (!user) {
      return null;
    }

    const addLike = await Likes.create({ postId, userId: user.userId });
    return addLike;
  };

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
