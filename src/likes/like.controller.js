const LikeService = require('./like.service');

class LikeController {
  constructor() {
    this.likeService = new LikeService();
  }

  clickLike = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { email } = req.user;

      const updatedLikeState = await this.likeService.clickLike(postId, email);

      return res.status(200).json({ liked: updatedLikeState });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = LikeController;
