const LikeService = require('./like.service');

class LikeController {
  likeService = new LikeService();

  clickLike = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const userId = req.user.id;
      const clickLike = await this.likeService.clickLike(postId, userId);

      if (!clickLike) {
        return res.status(200).json({ message: '좋아요 등록 취소' });
      }
      return res.status(200).json({ message: '좋아요 등록 완료' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = LikeController;
