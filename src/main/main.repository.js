const { Posts, Likes, sequelize, Sequelize } = require('../models');

class MainRepository {
  getMain = async () => {
    const getPosts = await Posts.findAll({
      where: { private: false },
      limit: 12,
      order: Sequelize.literal('RAND()'),
    });
    return getPosts;
  };

  getMainLiked = async () => {
    const likedPosts = await Posts.findAll({
      where: { private: false },
      attributes: {
        // Likes 테이블에서 Likes.postId가 Posts 테이블의 postId와 일치하는 항목의 개수를 계산
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
