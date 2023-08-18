const CommentRepository = require('./comment.repository');
const CustomError = require('../middlewares/error.middleware');

class CommentService {
  commentRepository = new CommentRepository();

  // 댓글 생성
  createComment = async (postId, email, method, comment) => {
    if (!comment || comment.trim() === '') {
      throw new Error('Comment cannot be empty');
    }
    const createComment = await this.commentRepository.createComment(
      postId,
      email,
      method,
      comment
    );
    return createComment;
  };

  // 게시글의 댓글 전체 조회
  getComments = async (postId) => {
    const getComments = await this.commentRepository.getComments(postId);
    const commentList = getComments.map((comment) => {
      return {
        commentId: comment.commentId,
        email: comment.User.email,
        nickname: comment.User.nickname,
        userImage: comment.User.userImage,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    });
    return commentList;
  };

  // 댓글 수정
  updateComment = async (postId, email, method, commentId, comment) => {
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
      method,
      commentId
    );
    if (!validateComment) {
      throw new Error('댓글 수정 권한이 없습니다.', 403);
    }

    const updatedComment = await this.commentRepository.updateComment(
      postId,
      email,
      method,
      commentId,
      comment
    );
    return updatedComment;
  };

  // 댓글 삭제
  deleteComment = async (postId, email, method, commentId) => {
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
      method,
      commentId
    );
    if (!validateComment) {
      throw new Error('댓글 삭제 권한이 없습니다.', 403);
    }

    const deleteComment = await this.commentRepository.deleteComment(
      postId,
      email,
      method,
      commentId
    );
    return deleteComment;
  };
}

module.exports = CommentService;
