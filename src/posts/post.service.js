const PostRepository = require('./post.repository')
const sequelize = require('sequelize')
const { deleteImageFromS3 } = require('../middlewares/multerS3.middleware')
// const { Images } = require('../models')

class PostService {

  postRepository = new PostRepository()

  //* 게시글 생성 part
  createPostWithImage = async (
    userId,
    images,
    content,
    // musicTitle,
    // musicUrl,
    // tag,
    latitude,
    longitude,
    placeName
  ) => {

    try {  
      const transaction = await sequelize.transaction()

      // create Posts
      const post = await this.postRepository.createPost(
        userId,
        content,
        latitude,
        longitude,
        placeName,
        transaction
      )

      // imgages에서 location 속성 추출
      // [ '...', '...', '...' ]
      const imageLocation = images.map((image) => {
        return image[0].location 
      })


      const image = await this.postRepository.createImage(
        userId,
        imageLocation,
        transaction
      )

      await transaction.commit()

      return { success: true }

    } catch (err) {
      await transaction.rollback()
      next(err)
    }
  };

    //* 게시글 상세 조회 part
    findPostWithImage = async (postId, userId) => {
  
      const item = await this.postRepository.findPostWithImage(postId, userId)
      
      return {
        postId: item.postId,
        userId: item.userId,
        nickname: item.Users.nickname,
        userImage: item.Users.userImage,
        images: item.Images ,
        content: item.content,
        latitude: item.latitude,
        longitude: item.longitude,
        placeName: item.placeName,
        private: item.private,
        likes: item.Likes,
        comment: item.Comments
        // musicTitle: item.musicTitle, // 2차 mvp
        // musicUrl: item.musicUrl, // 2차 mvp
        // tag: item.tag, // 2차 mvp
      }
  };

   //* 게시글 수정 part
   updatePostWithImage = async (
    content, 
    latitude, 
    longitude, 
    placeName, 
    images, 
    userId
    ) => {
      const updatePostWithImage = this.postRepository.updatePostWithImage(
        content, 
        latitude, 
        longitude, 
        placeName, 
        images, 
        userId
      )
    }



  //* 게시글 삭제 part
  // S3버킷과 DB의 이미지를 동시에 삭제하기 위해 트랜잭션 적용
  deletePostWithImage = async (postId, userId) => {
    const transaction = sequelize.transaction()

    try {
      // 1. postId 기준 이미지 url 찾기
      // findImageUrl = [
      //   { url: '첫 번째 이미지 URL' },
      //   { url: '두 번째 이미지 URL' },
      //   { url: '세 번째 이미지 URL' }
      // ]
      const findImageUrl 
      = await this.postRepository.findImageUrl(postId, userId, transaction)
      
      // 2. S3 버킷 이미지 삭제
      await Promise.all(findImageUrl.map( async (image) => {
        await deleteImageFromS3( transaction, image.url )
      }));

      // 3. DB 이미지 삭제
      const deletePostWithImage 
      = await this.postRepository.deletePostWithImage(postId, userId, transaction) 

      await transaction.commit()

      return deletePostWithImage
    } catch (err) {
      await transaction.rollback()
      next(err)
    }
  };

  findPostUserId = async (userId) => {
    const findPostUserId = await this.postRepository(userId)
    return findPostUserId
  }

};

module.exports = PostService