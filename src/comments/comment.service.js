const CommentRepository = require('./comment.repository');
const CustomError = require('../middlewares/error.middleware');

class CommentService {
  commentRepository = new CommentRepository();

  createComment = async (postId, email, comment) => {
    const createComment = await this.commentRepository.createComment(
      postId,
      email,
      comment
    );
    return createComment;
  };

  getComments = async (postId) => {
    const getComments = await this.commentRepository.getComments(postId);
    const commentList = getComments.map((comment) => {
      return {
        commentId: comment.commentId,
        email: comment.email,
        nickname: comment.User.nickname,
        userImage: comment.User.userImage,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    });
    return commentList;
  };

  updateComment = async (postId, email, commentId, comment) => {
    const postExists = await this.commentRepository.checkPostExists(postId);
    if (!postExists) {
      throw new CustomError('게시글이 존재하지 않습니다.', 404);
    }

    const commentExists = await this.commentRepository.checkCommentExists(
      commentId
    );
    if (!commentExists) {
      throw new CustomError('해당 댓글이 존재하지 않습니다.', 404);
    }

    const validateComment = await this.commentRepository.findComment(
      email,
      commentId
    );
    if (!validateComment) {
      throw new Error('댓글 수정 권한이 없습니다.', 403);
    }

    const updatedComment = await this.commentRepository.updateComment(
      postId,
      email,
      commentId,
      comment
    );
    return updatedComment;
  };

  deleteComment = async (postId, email, commentId) => {
    const postExists = await this.commentRepository.checkPostExists(postId);
    if (!postExists) {
      throw new CustomError('게시글이 존재하지 않습니다.', 404);
    }

    const commentExists = await this.commentRepository.checkCommentExists(
      commentId
    );
    if (!commentExists) {
      throw new CustomError('해당 댓글이 존재하지 않습니다.', 404);
    }

    const validateComment = await this.commentRepository.findComment(
      email,
      commentId
    );
    if (!validateComment) {
      throw new Error('댓글 삭제 권한이 없습니다.', 403);
    }

    const deleteComment = await this.commentRepository.deleteComment(
      postId,
      email,
      commentId
    );
    return deleteComment;
  };
}

module.exports = CommentService;
