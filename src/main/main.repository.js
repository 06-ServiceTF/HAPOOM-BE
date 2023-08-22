const {
  Posts,
  Users,
  Images,
  Likes,
  Mappings,
  Tags,
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
        { model: Mappings, include: [{ model: Tags, attributes: ['tag'] }] },
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
        { model: Mappings, include: [{ model: Tags, attributes: ['tag'] }] },
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

  getMainTags = async() => {
    const mainTags = await Posts.findAll({ 
      where: { private: false },
      include: [
        { model: Users, attributes: ['nickname'] },
        { model: Images, attributes: ['url'], limit: 1 },
        { model: Mappings, include: [{ model: Tags, attributes: ['tag'], limit: 1}] },
      ],
      limit: 15,
      order: Sequelize.literal('RAND()')
    })

    return mainTags
  }
};

module.exports = MainRepository;