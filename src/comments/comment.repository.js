const { Users, Posts, Comments } = require('../models');
const { Op } = require('sequelize');

class CommentRepository {
  // 댓글 생성
  createComment = async (postId, email, comment) => {
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

  // 게시글의 댓글 전체 조회
  getComments = async (postId) => {
    const getComments = await Comments.findAll({
      where: { postId },
      include: { model: Users, attributes: ['nickname', 'userImage'] },
      order: [['createdAt', 'desc']],
    });
    return getComments;
  };

  // 댓글 수정
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

  // 댓글 삭제
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

  // 게시글 존재 여부
  checkPostExists = async (postId) => {
    const postExists = await Comments.findOne({ where: { postId } });
    return postExists;
  };

  // 댓글 존재 여부
  checkCommentExists = async (commentId) => {
    const commentExists = await Comments.findOne({ where: { commentId } });
    return commentExists;
  };

  // 권한 여부
  findComment = async (email, commentId) => {
    const user = await Users.findOne({
      where: { email },
      attributes: ['userId'],
    });
    const comment = await Comments.findOne({
      where: { commentId, userId: user.userId },
    });
    return comment;
  };
}

module.exports = CommentRepository;
