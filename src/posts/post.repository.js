const { Posts, Images, Comments, Likes } = require("../models");
const { Op } = require("sequelize");

class PostRepository {

  //* 상세 페이지 생성(완료)
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


  //* 게시글 상세 조회(완료): postId만 있을 경우
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

    //* 게시글 수정 part(완료)
    // 게시글 수정 시, 기존 이미지를 빼면 DB는 CASCADE로 인해 자동 삭제
    updatePostWithImage = async (
      postId,
      content,
      latitude,
      longitude,
      placeName,
      updatedImage, // ['url1', 'url2', ...]
      userId
    ) => {

        // 상세 페이지 수정
        const updatePost = await Posts.update({
          where: {[Op.and]: [{ postId }, { userId }]}
        }, {
          content,
          latitude,
          longitude,
          placeName
        }, { transaction })

        // 이미지 수정
        const updateImage = await Promise.all(updatedImage.map( async (image) => {
          return await Image.update({
            where: { [Op.and]: [{ postId }, { userId }]}
          },
          { updatedImage }, 
          { transaction })
        }))

        return {updatePost, updateImage}
    };

    //* 게시글 삭제 part(완료)
    findImageUrl = async (postId, userId, transaction) => {
      const findImageUrl = await Images.findAll({
        where: { [Op.and]: [ { postId }, { userId }]},
        attributes: ['url']
      }, { transaction })

      return findImageUrl // [{url: '첫 번째 이미지 url'}, {url: '두 번째 이미지 url'}]
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
