const { Posts, Likes } = require('../models');

class MainRepository {
  // 메인 게시글 랜덤 9개
  getMain = async () => {
    const totalCount = await Posts.count();
    const randomIndexes = [];
    while (randomIndexes.length < 9) {
      const randomIndex = Math.floor(Math.random() * totalCount);
      if (!randomIndexes.includes(randomIndex)) {
        randomIndexes.push(randomIndex);
      }
    }

    const getPosts = await Posts.findAll({
      limit: 9,
      // 이전에 가져온 게시글을 건너뛰고, 그 다음부터 새로운 결과를 가져오게 함.
      offset: randomIndexes,
    });
    return getPosts;
  };

  // 좋아요 내림차순 게시글
  getMainLiked = async () => {
    const getLikedPosts = await Posts.findAll({
      include: [{ model: Likes }],
      limit: 10,
      order: [[{ model: Likes }, 'createdAt', 'DESC']],
    });
    return getLikedPosts;
  };
}

module.exports = MainRepository;
