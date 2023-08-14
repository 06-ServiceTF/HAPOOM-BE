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

  findComment = async (email, commentId) => {
    const comment = await Comments.findOne({ where: { commentId, email } });
    return comment;
  };

  createComment = async (postId, email, comment) => {
    if (!comment || comment.trim() === "") {
      throw new Error("Comment cannot be empty");
    }  
    const user = await Users.findOne({
      where: { email },
      attributes: ['userId'],
    });
    const createComment = await Comments.create({
      postId,
      userId: user.userId,
      comment,
    });
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

  updateComment = async (postId, email, commentId, comment) => {
    const user = await Users.findOne({
      where: { email },
      attributes: ['userId'],
    });
    const updateComment = await Comments.update(
      { comment },
      {
        where: {
          [Op.and]: [{ postId }, { userId: user.userId }, { commentId }],
        },
      }
    );
    return updateComment;
  };

  deleteComment = async (postId, email, commentId) => {
    const user = await Users.findOne({
      where: { email },
      attributes: ['userId'],
    });
    const deleteComment = await Comments.destroy({
      where: {
        [Op.and]: [{ postId }, { userId: user.userId }, { commentId }],
      },
    });
    return deleteComment;
  };
}

module.exports = CommentRepository;
