const CommentService = require('./comment.service');

class CommentController {
  commentService = new CommentService();

  createComment = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { comment } = req.body;
    try {
      const createComment = await this.commentService.createComment(
        postId,
        userId,
        comment
      );
      return res.status(201).json({ message: '댓글을 작성하였습니다.' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

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

  updateComment = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { postId, commentId } = req.params;
    const { comment } = req.body;
    try {
      const updateComment = await this.commentService.updateComment(
        postId,
        userId,
        commentId,
        comment
      );
      return res.status(200).json({ message: '댓글을 수정하였습니다.' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  deleteComment = async (req, res, next) => {
    try {
      const { postId, commentId } = req.params;
      const { userId } = res.locals.user;
      const deleteComment = await this.commentService.deleteComment(
        postId,
        userId,
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
