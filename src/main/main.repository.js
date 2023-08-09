const { Posts, Images, Likes, sequelize, Sequelize } = require('../models');

class MainRepository {
  getMain = async () => {
    const getPosts = await Posts.findAll({
      where: { private: false },
      include: { model: Images, attributes: ['url'] },
      limit: 12,
      order: Sequelize.literal('RAND()'),
    });

    const formattedPosts = getPosts.map((post) => {
      const formattedPost = {
        postId: post.postId,
        userId: post.userId,
        content: post.content,
        latitude: post.latitude,
        longitude: post.longitude,
        private: post.private,
        tag: post.tag,
        musicTitle: post.musicTitle,
        musicUrl: post.musicUrl,
        placeName: post.placeName,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };

      if (post.Images && post.Images.length > 0) {
        formattedPost.Image = {
          url: post.Images[0].url,
        };
      }
      return formattedPost;
    });
    return formattedPosts;
  };

    // const getPosts = Array.from({ length: 12 }).map((_, id) => ({
    //   id: id + 1,
    //   content: "ㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㅇ",
    //   musicTitle: "버즈(Buzz) - 가시 [가사/Lyrics]",
    //   musicUrl: "https://www.youtube.com/watch?v=1-Lm2LUR8Ss",
    //   tag: "도라에몽, 펀치",
    //   placeName: "전라남도 완도군 완도읍 신기길 56 3 ",
    //   latitude: 126.742,
    //   longitude: 34.3275,
    //   private: false,
    //   createdAt: "2023-08-03T07:51:46.000Z",
    //   updatedAt: "2023-08-03T07:51:46.000Z",
    //   userId: 1,
    //   image: {
    //     url: "https://avatars.githubusercontent.com/u/32028454?v=4"
    //   }
    // }));

  getMainLiked = async () => {
    // const likedPosts = Array.from({ length: 5 }).map((_, id) => ({
    //   id: id + 1,
    //   content: "ㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㅇ",
    //   musicTitle: "버즈(Buzz) - 가시 [가사/Lyrics]",
    //   musicUrl: "https://www.youtube.com/watch?v=1-Lm2LUR8Ss",
    //   tag: "도라에몽, 펀치",
    //   placeName: "전라남도 완도군 완도읍 신기길 56 3 ",
    //   latitude: 126.742,
    //   longitude: 34.3275,
    //   private: false,
    //   createdAt: "2023-08-03T07:51:46.000Z",
    //   updatedAt: "2023-08-03T07:51:46.000Z",
    //   userId: 1,
    //   image: {
    //     url: "https://avatars.githubusercontent.com/u/32028454?v=4"
    //   }
    // }));
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
