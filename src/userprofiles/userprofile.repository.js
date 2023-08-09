const {
  Posts,
  Users,
  Images,
  Likes,
  sequelize,
  Sequelize,
} = require('../models');

class UserprofileRepository {
  // 유저가 작성한 게시글 가져오기
  userPosts = async (userId, loggedInUserId) => {
    const userPosts = await Posts.findAll({
      where: {
        userId,
        private: false, // public 게시글만 가져오기
      },
      include: [
        { model: Users, attributes: ['nickname', 'userImage'] },
        { model: Images, attributes: ['url'] },
      ],
    });

    // 프로필 주인인 경우, private 게시글도 가져오기
    if (userId === loggedInUserId) {
      const privatePosts = await Posts.findAll({
        where: {
          userId,
          private: true,
        },
        include: [
          { model: Images, attributes: ['url'] },
        ],
      });
      userPosts.push(...privatePosts);
    }

    const formattedUserPosts = userPosts.map((post) => {
      const formattedPost = {
        postId: post.postId,
        userId: post.userId,
        content: post.content,
        private: post.private,
        tag: post.tag,
        user: {
          nickname: post.Users ? post.Users.nickname : null,
          userImage: post.Users ? post.Users.userImage : null,
        },
        images: post.Images.map((image) => ({
          url: image.url,
        })),
      };
      return formattedPost;
    });
    return formattedUserPosts;
  };

  // 유저가 좋아요를 누른 게시글 가져오기
  userLikedPosts = async (userId) => {
    const likedPosts = await Posts.findAll({
      include: [
        {
          model: Likes,
          where: { userId },
        },
        { model: Images, attributes: ['url'] },
        { model: Users, attributes: ['nickname', 'userImage'] },
      ],
    });

    // private(true) 게시글은 제외하여 필터링
    // likedPosts 배열을 순회 -> private = false인 경우만 filteredLikedPosts 배열에 남김
    // !post.private 부분은 private 값이 false인 경우 true를 반환, private 값이 true인 경우 false를 반환
    const filteredLikedPosts = likedPosts.filter((post) => !post.private);

    const formattedLikedPosts = filteredLikedPosts.map((post) => {
      const formattedPost = {
        postId: post.postId,
        userId: post.userId,
        content: post.content,
        private: post.private,
        tag: post.tag,
      };

      if (post.Images && post.Images.length > 0) {
        formattedPost.Image = {
          url: post.Images[0].url,
        };
      }
      return formattedPost;
    });
    return formattedLikedPosts;
  };
}

module.exports = UserprofileRepository;
