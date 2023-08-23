const {
  Posts,
  Users,
  Images,
  Likes,
  sequelize,
  Sequelize,
} = require('../models');

class MainRepository {
  getMain = async () => {
    const getPosts = await Posts.findAll({
      where: { private: false },
      include: [
        { model: Users, attributes: ['nickname'] },
        { model: Images, attributes: ['url'], limit: 1 },
      ],
      limit: 12,
      order: Sequelize.literal('RAND()'),
    });

    return getPosts;
  };

  getMainLiked = async () => {
    const likedPosts = await Posts.findAll({
      where: { private: false },
      include: [
        { model: Users, attributes: ['nickname'] },
        { model: Images, attributes: ['url'], limit: 1 },
      ],
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
    });

    return likedPosts;
  };

  getFeed = async () => {
    const getFeed = await Posts.findAll({
      where: { private: false },
      include: [
        { model: Users, attributes: ['nickname', 'userImage'] },
        { model: Images, attributes: ['url'], limit: 1 },
      ],
      limit: 12,
      order: Sequelize.literal('RAND()'),
    });

    return getFeed;
  };
}

module.exports = MainRepository;
