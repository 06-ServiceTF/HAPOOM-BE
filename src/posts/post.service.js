const PostRepository = require('./post.repository')
const { sequelize } = require('../models')
const { deleteImageFromS3 } = require('../middlewares/multerS3.middleware')

class PostService {

  postRepository = new PostRepository()

  //* 게시글 생성 part( 검토 완료 )
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
    
    const transaction = await sequelize.transaction()

    try {
      let imageLocation = []

      for (const image in images) {
        imageLocation.push(images[image][0].location)
      }
    
      // // 1
      // imageLocation = [
      //   'https://hapoomimagebucket.s3.ap-northeast-2.amazonaws.com/images/1691342208912_multer.png'
      // ]

      // // 2
      // imageLocation = [
      //   'https://hapoomimagebucket.s3.ap-northeast-2.amazonaws.com/images/1691374525807_CI%3ACD.png',
      //   'https://hapoomimagebucket.s3.ap-northeast-2.amazonaws.com/images/1691374525808_Docker.png'
      // ]

      // console.log('imageUrl', imageLocation)
      const createPostWithImage
      = await this.postRepository.createPostWithImage(
        userId, 
        imageLocation, 
        content, 
        latitude, 
        longitude, 
        placeName,
        transaction
        )

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      console.log('createPostWithImage', err)
    }
  };

    //* 게시글 상세 조회 part (검토 완료)
    findPostWithImage = async (postId, userId) => {
  
      const item = await this.postRepository.findPostWithImage(postId, userId)
      
      return {
        userId: item.userId,
        postId: item.postId,
        content: item.content,
        latitude: item.latitude,
        longitude: item.longitude,
        private: item.private,
        url: item['Images.url'],
        nickname: item["User.nickname"],
        userImage: item["User.userImage"],
        isLiked: item.isLiked,
        likeCount: item.likeCount,
        // comments를 객체형태로 줘보자
        comment: item.Comments
      }
  };

   //* 게시글 수정 part
   // images 분해해서 location 속성 꺼내야 함
   // transaction 적용 필요
   updatePostWithImage = async (
    postId,
    userId,
    content,
    latitude,
    longitude,
    placeName,
    images
    ) => {
      const transaction = await sequelize.transaction()

      try {
        // images = req.files url과 location 배열로 가공
        let image1 = []
        let image2 = []

        for (const image in images) {
          image1.push(images[image][0].url)
        }

        for (const image in images) {
          image2.push(images[image][0].location)
        }

        const totalImage = image1.concat(image2)
        // 수정되는 이미지 url
        let updateImageArray = totalImage.filter(item => Boolean(item) == true)

        // findImages // 배열값 [{url: '첫 번째 이미지 url'}, {url: '두 번째 이미지 url'}]
        const findImageUrl = await this.postRepository(postId, userId, transaction)

        let image3 = []

        for (const image of findImageUrl) {
          image3.push(image.url)
        }

        // S3 버킷 삭제 이미지 url
        let deleteImageFromS3 = []
        for (let i = 0; i < image3.length; i++) {
          if ( updateImageArray.indexOf(image3[i]) == -1) {
            deleteImageFromS3.push(image3[i])
          }
        }

        // S3 버킷 삭제
        const deleteS3 = deleteImageFromS3.map(async(image) => {
          return await deleteImageFromS3(image)
        })

        // update 로직
        const updatePostWithImage = this.postRepository.updatePostWithImage(
          postId,
          userId,
          content, 
          latitude, 
          longitude, 
          placeName, 
          updateImageArray, // 배열 ['url1', 'url2', ...]
          transaction
        )

        await transaction.commit()

        return updatePostWithImage
      } catch (err) {
        await transaction.rollback()
        console.log('updatePostWithImage', err)
      }
     
    };

  //* 게시글 삭제 part (검토 완료)
  deletePostWithImage = async(postId, userId) => {
    // Images테이블 url 찾기
    const findImageKey = await this.postRepository.findImageKey(
      postId,
      userId
    )
    
    // S3 버킷 삭제할 image.path 추출
    let filePath = []
    findImageKey.forEach(image => {
      // URL()에서 파일 경로 추출
      const urlParts = new URL(image["dataValues"]["url"]) // new URL(url)
      const decodedPath = decodeURIComponent(urlParts.pathname.substring(1)); // 디코딩된 문자열 다시 인코딩
      filePath.push(decodedPath);
    })
    // console.log('filePath', filePath)

    // S3버킷 삭제 ( 재검토 필요)
    const deleteS3 = filePath.map( async(url) => {
      return await deleteImageFromS3(url)
    })

    // 게시글 삭제
    const deletePostWithImage = await this.postRepository.deletePostWithImage(
      postId,
      userId
    )

    return deletePostWithImage
  };
};


module.exports = PostService