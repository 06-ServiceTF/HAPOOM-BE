const sequelize = require('sequelize')
const { Posts, Images, Comments, Likes } = require('../models')
const { Op } = sequelize
// 트랜잭션 적용 필요(완료)
// multer-s3 적용 필요(완료)
// 이미지를 넣을려고 할려면 postId가 필요(완료)

class PostRepository {

  createPostWithImage = async (
    userId,
    nickname,
    images,
    content, 
    musicTitle, 
    musicUrl, 
    tag, 
    latitude, 
    longitude, 
    placeName) => {

      try {
        const transaction = await sequelize.transaction()

        // Posts 테이블 저장
        const postData = await Posts.create({
          userId,
          nickname,
          content, 
          musicTitle, 
          musicUrl, 
          tag, 
          latitude, 
          longitude, 
          placeName},
          {transaction});

        console.log(postData.dataValues.id)

        // Images 테이블 저장
        const imagePromises = images.map((image) => {
          return Images.create({
            url: req.protocol + '://' + req.get('host') + '/' + image.path,
            postId: postData.dataValues.id,
            userId: userId
          }, {transaction})
        });

        await Promise.all(imagePromises)

        await transaction.commit()
      } catch (err) {
        await transaction.rollback()
        console.log(err)
      }
  };

  // 게시글 상세 조회: postId만 있을 경우
  findPostWithImage = async (postId, userId) => {
    try {
      const postWithImage = await Posts.findOne({
        where: { postId },
        attributes: [
        'postId',
        'userId',
        'content',
        // 'tag',
        'latitude',
        'longitue',
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
            model: Comments,
            attributes: ['commentId','comment', 'createdAt']
          },
          {
            model: Users,
            attributes: ['nickname', 'userImage']
          }
        ],
        raw: true
      })

      // 좋아요 여부 확인
      const userLiked = postWithImage.Likes.some((like) => like.userId === userId)
      postWithImage.userLiked = userLiked

      // 좋아요 count 조회
      const likeCount = postWithImage.Likes.length
      postWithImage.likeCount = likeCount

      return postWithImage
    } catch (err) {
      next(err)
    }
  };

  // 게시글 수정



  // 게시글 삭제
  deletePostWithImage = async (postId, userId) => {
    

  }
};

module.exports = PostRepository