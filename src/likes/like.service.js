const LikeRepository = require('./like.repository');

class LikeService {
  likeRepository = new LikeRepository();

  clickLike = async (postId, userId) => {
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
