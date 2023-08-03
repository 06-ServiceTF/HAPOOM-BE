const { Posts, Likes, sequelize, Sequelize } = require('../models');

class MainRepository {
  // 메인 게시글 랜덤 9개 조회
  getMain = async () => {
    const getPosts = await Posts.findAll({
      limit: 9,
      order: Sequelize.literal('RAND()'),
    });
    return getPosts;
  };

  // 좋아요가 많은 게시글 내림차순 조회
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
