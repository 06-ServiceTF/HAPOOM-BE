const { Posts, Images, Comments, Likes } = require("../models");
const { Op } = require("sequelize");

class PostRepository {

  createPost = async (
    userId,
    content,
    latitude,
    longitude,
    placeName,
    transaction
  ) => {
    const post = await Posts.create({
      userId,
      content,
      latitude,
      longitude,
      placeName
    }, {transaction})

    return post
  };

  // [ '...', '...', '...' ]
  createImage = async (userId, imageLocation, transaction) => {

    const images = await Promise.all(imageLocation.map(async (image) => {
      return await Images.create({
        userId,
        postId,
        url: image
      }, { transaction })
    }))

    return images
  };


  // 게시글 상세 조회: postId만 있을 경우
  findPostWithImage = async (postId, userId) => {

    try {
      const postWithImage = await Posts.findOne({
        where: { postId },
        attributes: [
          "postId",
          "userId",
          "content",
          // 'tag',
          "latitude",
          "longitue",
          "private",
        ],
        include: [
          {
            model: Images,
            attributes: ["url"],
          },
          {
            model: Likes,
            attributes: ["userId"],
          },
          {
            model: Comments,
            attributes: ["commentId", "comment", "createdAt"],
          },
          {
            model: Users,
            attributes: ["nickname", "userImage"],
          },
        ],
        raw: true,
      });

      // 좋아요 여부 확인
      const userLiked = postWithImage.Likes.some(
        (like) => like.userId === userId
      );
      postWithImage.userLiked = userLiked;

      // 좋아요 count 조회
      const likeCount = postWithImage.Likes.length;
      postWithImage.likeCount = likeCount;

      return postWithImage;
    } catch (err) {
      next(err);
    }
  }

    // 게시글 수정 part
    // 게시글 수정 시, 기존 이미지를 빼면 DB는 CASCADE로 인해 자동 삭제
    //! DB의 Images 테이블의 url은 삭제가 되나 S3 버킷에 있는 이미지는 삭제가 안됨
    updatePostWithImage = async (
      content,
      latitude,
      longitude,
      placeName,
      images,
      userId
    ) => {
      

        const updatePost = await Posts.update({});

        const updateImage = await Images.update();

    };

    // 게시글 삭제 part
    findImageUrl = async (postId, userId, transaction) => {
      const findImageUrl = await Images.findOne({
        where: { [Op.and]: [ { postId }, { userId }]},
        attributes: ['url']
      }, { transaction })

      return findImageUrl
    };

    deletePostWithImage = async (postId, userId, transaction) => {

      const deletePostWithImage = await Posts.destroy({
        where: { [Op.and]: [{ postId: postId }, { userId: userId }] },
      }, { transaction });

      return deletePostWithImage
    };

    findPostUserId = async (userId) => {
      const findPostUserId = await Posts.findOne({
        where: {userId},
        attributes: ['postId', 'userId']
      })
      return findPostUserId
    }

};





module.exports = PostRepository;
