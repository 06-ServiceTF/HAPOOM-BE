const CommentRepository = require('./comment.repository');
const CustomError = require('../middlewares/error.middleware');

class CommentService {
  commentRepository = new CommentRepository();

  createComment = async (postId, userId, comment) => {
    // 게시글 존재 여부 확인
    const postExists = await this.commentRepository.checkPostExists(postId);
    if (!postExists) throw new CustomError('게시글이 존재하지 않습니다.', 404);

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
