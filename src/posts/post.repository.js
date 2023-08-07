// post.repository
const { Posts, Images, Comments, Likes, Users } = require("../models");
const { Op } = require("sequelize");
class PostRepository {

//* 게시글 생성 part (검토 완료)
createPostWithImage = async(
  userId, 
  imageLocation, 
  content, 
  latitude, 
  longitude, 
  placeName,
  transaction
) => {

  const createPost = await Posts.create({
    userId,
    content,
    latitude,
    longitude,
    placeName
  }, {transaction})

  const createImage = imageLocation.map( async(image) => {
    return await Images.create({
      userId,
      postId: createPost.dataValues.postId,
      url: image
    })
  }, {transaction})

  };

  //* 게시글 조회 part (검토 완료)
  findPostWithImage = async(postId, userId) => {
    const findPostWithImage = await Posts.findOne({
      where: { postId},
      attributes: [
        'userId',
        'postId',
        'content',
        'latitude',
        'longitude',
        'private'
      ],
      include: [
        {
          model: Images,
          attributes: ['url']
        },
        {
          model: Likes,
          attributes: ['userId']
        },
        {
          model: Users,
          attributes: ['nickname', 'userImage']
        },
        {
          model: Comments,
          attributes: ['userId', 'comment', 'createdAt']
        }
      ],
      // raw: true
    })
    
    // '좋아요'가 아무것도 없으면 빈 배열 만들기
    const userLike = findPostWithImage["Likes.userId"] ?? Array()

    // console.log('userLike =>', userLike)
    userLike.push(1)
    userLike.push(2)

    // 좋아요 여부 확인
    const isLiked = userLike.some((like) => {
      return like == userId
    })
    findPostWithImage.isLiked = isLiked

    // 좋아요 count 조회
    const likeCount = userLike.length
    findPostWithImage.likeCount = likeCount

    // console.log('result', findPostWithImage)
    return findPostWithImage
  };

  //* 게시글 수정 part
  updatePostWithImage = async(
    postId,
    userId,
    content, 
    latitude, 
    longitude, 
    placeName, 
    updateImageArray, // 배열 ['url1', 'url2', ...]
    transaction
  ) => {
    const updatePost = await Posts.update({
      where: {[Op.and]: [{ postId}, {userId}]}
    },
    {
      content,
      latitude,
      longitude,
      placeName
    },
    { transaction }
    )

    const updatedImage = await updateImageArray.map(async(image) => {
      return await Images.update({
        where: { [Op.and]: [{ postId }, { userId }]}
      },
      { url: image },
      { transaction }
      )
    });
  };

  //* 게시글 삭제 part
  // Images 테이블 url 찾기
  findImageKey = async(postId, userId) => {
    const findImageKey = await Images.findAll({
      where: {[Op.and]: [{postId}, {userId}]},
      attributes: ['url']
    })

    return findImageKey
  }

  // 게시물 삭제
  deletePostWithImage = async(postId, userId) => {
    const deletePostWithImage = await Posts.destroy({
      where: {[Op.and]: [{ postId }, { userId }]}
    })

    // console.log(deletePostWithImage) // 성공 시 1
    return deletePostWithImage
  }
};


module.exports = PostRepository;