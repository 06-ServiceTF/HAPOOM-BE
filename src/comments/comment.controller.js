const CommentService = require('./comment.service');

class CommentController {
  commentService = new CommentService();

  // 댓글 생성
  createComment = async (req, res, next) => {
    const { email, method } = req.user;
    const { postId } = req.params;
    const { comment } = req.body;
    try {
      const createComment = await this.commentService.createComment(
        postId,
        email,
        method,
        comment
      );
      return res.status(201).json({ message: '댓글을 작성하였습니다.' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // 게시글의 댓글 전체 조회
  getComments = async (req, res, next) => {
    const { postId } = req.params;
    try {
      const comment = await this.commentService.getComments(postId);
      return res.status(200).json({ comments: comment });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // 댓글 수정
  updateComment = async (req, res, next) => {
    const { email, method } = req.user;
    const { postId, commentId } = req.params;
    const { comment } = req.body;
    try {
      const updateComment = await this.commentService.updateComment(
        postId,
        email,
        method,
        commentId,
        comment
      );
      return res.status(200).json({ message: '댓글을 수정하였습니다.' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // 댓글 삭제
  deleteComment = async (req, res, next) => {
    try {
      const { postId, commentId } = req.params;
      const { email, method } = req.user;
      const deleteComment = await this.commentService.deleteComment(
        postId,
        email,
        method,
        commentId
      );
      return res.status(200).json({ message: '댓글을 삭제하였습니다.' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = CommentController;
