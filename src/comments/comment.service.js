const CommentRepository = require('./comment.repository');
const CustomError = require('../middlewares/error.middleware')

class CommentService {
  commentRepository = new CommentRepository();

  createComment = async (postId, userId, comment) => {
    const createComment = await this.commentRepository.createComment(
      postId,
      userId,
      comment
    );
    return createComment;
  };

  getComments = async (postId) => {
    const getComments = await this.commentRepository.getComments(postId);
    const commentList = getComments.map((comment) => {
      return {
        commentId: comment.commentId,
        userId: comment.userId,
        nickname: comment.User.nickname,
        userImage: comment.User.userImage,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    });
    return commentList;
  };

  updateComment = async (postId, userId, commentId, comment) => {
    const updateComment = await this.commentRepository.updateComment(
      postId,
      userId,
      commentId,
      comment
    );
    return updateComment;
  };

  deleteComment = async (postId, userId, commentId) => {
    const deleteComment = await this.commentRepository.deleteComment(
      postId,
      userId,
      commentId
    );
    return deleteComment;
  };
}

module.exports = CommentService;
