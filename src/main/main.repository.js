const {
  Posts,
  Users,
  Images,
  Likes,
  Mappings,
  Comments,
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

  getMainTags = async () => {
    const mainTags = await Posts.findAll({
      where: { private: false },
      include: [
        { model: Images, attributes: ['url'], limit: 1 },
        { model: Tags },
      ],
      limit: 15,
      order: sequelize.literal('RAND()'),
    });

    return mainTags;
  };

  getFeed = async (page) => {
    const limit = 12;
    const offset = (page - 1) * limit;

    // 총 포스트 수 가져오기
    const totalPosts = await Posts.count();
    const totalPages = Math.ceil(totalPosts / limit);

    const feedData = await Posts.findAll({
      where: { private: false },
      include: [
        {
          model: Users,
          attributes: ['userId', 'email', 'nickname', 'userImage', 'preset'],
        },
        { model: Images, attributes: ['url'], limit: 1 },
        {
          model: Tags,
          attributes: ['tag'],
          through: { attributes: [] },
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      content: feedData,
      totalPages,
      totalElements: totalPosts,
    };
  };

  getCommentCount = async (postId) => {
    const commentCount = await Comments.count({ where: { postId } });
    return commentCount;
  };
}

module.exports = MainRepository;
