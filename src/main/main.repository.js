const { Posts, Likes, sequelize } = require('../models');

class MainRepository {
  // 메인 게시글 랜덤 9개
  getMain = async () => {
    // const totalCount = await Posts.count();
    // const randomIndexes = [];
    // while (randomIndexes.length < 9) {
    //   const randomIndex = Math.floor(Math.random() * totalCount);
    //   if (!randomIndexes.includes(randomIndex)) {
    //     randomIndexes.push(randomIndex);
    //   }
    // }

    const getPosts = await Posts.findAll({
      limit: 9,
      // 이전에 가져온 게시글을 건너뛰고, 그 다음부터 새로운 결과를 가져오게 함.
      // offset: randomIndexes,
    });
    return getPosts;
  };

  // 좋아요가 많은 게시글 내림차순
  getMainLiked = async () => {
    const likedPosts = await Posts.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Likes
              WHERE Likes.postId = Posts.postId
            )`),
            'likesCount',
          ],
        ],
      },
      order: [['likesCount', 'DESC']],
      limit: 10,
      raw: true, // 결과를 순수한 JSON 객체로 반환
    });

    return likedPosts;
  };
}

module.exports = MainRepository;
