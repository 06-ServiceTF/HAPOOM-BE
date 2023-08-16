const LikeRepository = require('./like.repository');
const CustomError = require('../middlewares/error.middleware');

class LikeService {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  clickLike = async (postId, email, method) => {
    const postExists = await this.likeRepository.checkPostExists(postId);
    if (!postExists) throw new CustomError('게시글이 존재하지 않습니다.', 404);

    const existLike = await this.likeRepository.existLike(postId, email, method);
    if (existLike) {
      await this.likeRepository.removeLike(postId, email, method);
      return false;
    }

    await this.likeRepository.addLike(postId, email, method);
    return true;
  };
}

module.exports = LikeService;
