const {
  Posts,
  Users,
  Images,
  Likes,
  sequelize,
  Sequelize,
} = require('../models');

class MainRepository {
  getImageUrl(filename) {
    return `/uploads/${filename}`; // 이미지 파일명을 기반으로 URL 생성
  }

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

    // uploads 파일 때문에 쓴 코드
    const postsWithImageUrl = getPosts.map((post) => ({
      ...post.dataValues,
      image: this.getImageUrl(post.Images[0].url),
    }));

    return postsWithImageUrl;
    // return getPosts;
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

    // uploads 파일 때문에 쓴 코드
    const likedPostsWithImageUrl = likedPosts.map((post) => ({
      ...post.dataValues,
      image: this.getImageUrl(post.Images[0].url),
    }));

    return likedPostsWithImageUrl;
    // return likedPosts;
  };
}

module.exports = MainRepository;
