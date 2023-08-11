const LikeRepository = require('./like.repository');
const CustomError = require('../middlewares/error.middleware');

class LikeService {
  likeRepository = new LikeRepository();

  clickLike = async (postId, userId) => {
    // 게시글 존재 여부 확인
    const postExists = await this.likeRepository.checkPostExists(postId);
    if (!postExists) throw new CustomError('게시글이 존재하지 않습니다.', 404);

    const existLike = await this.likeRepository.existLike(postId, userId);
    if (existLike) {
      const removeLike = await this.likeRepository.removeLike(postId, userId);
      return false;
    }
    const addLike = await this.likeRepository.addLike(postId, userId);
    return true;
  };
}

module.exports = LikeService;
