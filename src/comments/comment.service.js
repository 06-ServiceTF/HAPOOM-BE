const CommentRepository = require('./comment.repository');
const CustomError = require('../middlewares/error.middleware');

class CommentService {
  commentRepository = new CommentRepository();

  createComment = async (postId, userId, comment) => {
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
    const postExists = await this.commentRepository.checkPostExists(postId);
    if (!postExists) throw new CustomError('게시글이 존재하지 않습니다.', 404);

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
    const postExists = await this.commentRepository.checkPostExists(postId);
    if (!postExists) {
      throw new CustomError('게시글이 존재하지 않습니다.', 404);
    }

    const commentExists = await this.commentRepository.checkCommentExists(commentId);
    if (!commentExists) {
      throw new CustomError('해당 댓글이 존재하지 않습니다.', 404);
    }

    const updatedComment = await this.commentRepository.updateComment(
      postId,
      userId,
      commentId,
      comment
    );
    return updatedComment;
  };

  deleteComment = async (postId, userId, commentId) => {
    const postExists = await this.commentRepository.checkPostExists(postId);
    if (!postExists) {
      throw new CustomError('게시글이 존재하지 않습니다.', 404);
    }

    const commentExists = await this.commentRepository.checkCommentExists(commentId);
    if (!commentExists) {
      throw new CustomError('해당 댓글이 존재하지 않습니다.', 404);
    }

    const deleteComment = await this.commentRepository.deleteComment(
      postId,
      userId,
      commentId
    );
    return deleteComment;
  };
}

module.exports = CommentService;
