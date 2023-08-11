const { Users, Posts, Comments } = require('../models');
const { Op } = require('sequelize');

class CommentRepository {
  checkPostExists = async (postId) => {
    const postExists = await Comments.findOne({ where: { postId } });
    return postExists;
  };

  checkCommentExists = async (commentId) => {
    const commentExists = await Comments.findOne({ where: { commentId } });
    return commentExists;
  };

  findComment = async (userId, commentId) => {
    const comment = await Comments.findOne({ where: { commentId, userId } });
    return comment;
  };

  createComment = async (postId, userId, comment) => {
    const createComment = await Comments.create({ postId, userId, comment });
    return createComment;
  };

  getComments = async (postId) => {
    const getComments = await Comments.findAll({
      where: { postId },
      include: { model: Users, attributes: ['nickname', 'userImage'] },
      order: [['createdAt', 'desc']],
    });
    return getComments;
  };

  updateComment = async (postId, userId, commentId, comment) => {
    const updateComment = await Comments.update(
      { comment },
      { where: { [Op.and]: [{ postId }, { userId }, { commentId }] } }
    );
    return updateComment;
  };

  deleteComment = async (postId, userId, commentId) => {
    const deleteComment = await Comments.destroy({
      where: { [Op.and]: [{ postId }, { userId }, { commentId }] },
    });
    return deleteComment;
  };
}

module.exports = CommentRepository;
