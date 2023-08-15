const { Posts, Likes, Users } = require('../models');
const { Op } = require('sequelize');

class LikeRepository {
  checkPostExists = async (postId) => {
    const postExists = await Posts.findOne({ where: { postId } });
    return postExists;
  };

  existLike = async (postId, email) => {
    const user = await Users.findOne({ where: { email } });
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

  addLike = async (postId, email) => {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    const addLike = await Likes.create({ postId, userId: user.userId });
    return addLike;
  };

  removeLike = async (postId, email) => {
    const user = await Users.findOne({ where: { email } });
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
