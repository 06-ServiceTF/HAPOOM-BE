const LikeService = require('./like.service');

class LikeController {
  likeService = new LikeService();

  clickLike = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { email } = req.user;
      const clickLike = await this.likeService.clickLike(postId, email);

      if (!clickLike) {
        return res.status(200).json({ message: '이 게시물에 대한 좋아요를 취소했습니다.' });
      }
      return res.status(200).json({ message: '이 게시물에 좋아요를 누르셨습니다.' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = LikeController;
