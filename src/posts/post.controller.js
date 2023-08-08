const PostService = require('./post.service')
const CustomError = require('../middlewares/error.middleware')

class PostController {
  postService = new PostService()

  //* 게시글 생성( 검토완료 )
  createPostWithImage = async (req, res, next) => {

    const { content, latitude, longitude, placeName } = req.body
    const { userId } = res.locals.user

    const images = req.files
    // images가 어떻게 생겼는지 확인 필요
    // req.files = {
    //   image1: [
    //     {
    //       fieldname: 'image1',
    //       originalname: 'image1_1.jpg',
    //       encoding: '7bit',
    //       mimetype: 'image/jpeg',
    //       size: 12345,
    //       bucket: 'your-bucket-name',
    //       key: 'uploads/image1_1.jpg', // S3 저장 경로
    //       acl: 'public-read', // 접근 제어 설정 (S3 버킷 권한)
    //       contentType: 'application/octet-stream',
    //       contentDisposition: null,
    //       storageClass: 'STANDARD',
    //       serverSideEncryption: null,
    //       metadata: null,
    //       location: 'https://your-bucket-name.s3.amazonaws.com/images/${Date.now().toString}_${file.originalname}.jpg', // S3 주소
    //                 image.path === ${Date.now().toString}_${file.originalname}.jpg
    //       etag: '"abcdefgh1234567890"',
    //       versionId: undefined
    //     }
    //   ],
    //   image2: [...], // 이하 동일한 구조로 나머지 이미지들이 배열에 담겨 있을 것입니다.
    //   image3: [...]
    // }

    try {
      // 로그인 유무 확인
      if (!userId) {
        throw new CustomError('로그인 후 사용가능합니다.', 401)
      }

      // 게시물 생성
      const createPostWithImage = await this.postService.createPostWithImage(
        userId,
        images,
        content,
        // musicTitle, //2차 mvp
        // musicUrl, // 2차 mvp
        // tag, // 2차 mvp
        latitude,
        longitude,
        placeName
      )
      
      res.status(201).json({message: '게시글 작성되었습니다.'})
    } catch (err) {
      next(err)
    }
  };

  //* 상세 게시글 조회( 검토완료 )
  findPostWithImage = async (req, res, next) => {
    const { postId } = req.params
    try {
      // 게시글 삭제 권한 확인

      // auth.middleware에서 값을 받아야 함
      let { userId } = res.locals.user
      
      const findPostWithImage = await this.postService.findPostWithImage(postId, userId)
      
      // 선택한 게시글이 없을 때
      if (!findPostWithImage) {
        return res.status(404).json({ errorMessage: '선택하신 게시글이 없습니다.'})
      }

      res.status(200).json({ findPostWithImage })
    } catch (err) {
      next(err)
    }
  };

  //* 상세 게시글 수정
  updatePostWithImage = async (req, res, next) => {
    const { postId } = req.params
    const { userId } = res.locals.user
    const { content, latitude, longitude, placeName } = req.body
    const images = req.files
    
    try {
      // 게시글 수정 권한 확인
      const confirmRight = this.postService.confirmRight(postId, userId)

      // 권한이 없다면 errorMessage
      if (!confirmRight) {
        throw new CustomError('수정 권한이 없습니다.', 403)
      }

      // 게시글 수정
      const updatePostWithImage = this.postService.updatePostWithImage( // {updatePost, updateImage}
        postId,
        userId,
        content,
        latitude,
        longitude,
        placeName,
        images
      )

      // 수정 실패 시 errorMessage
      if(!updatePostWithImage.updatePost.length) {
        throw new CustomError('수정에 실패했습니다.', 500)
      }

      res.status(200).json({ message: '게시글이 수정되었습니다.'})
    } catch (err) {
      next(err)
    }
  };

  //* 상세 게시글 삭제
  // 1차 목표: destroy기능으로 Posts 테이블 삭제, 이미지 테이블은 저절로 삭제 됨(완료)
  // 2차 목표: 트랜잭션으로 S3버킷 삭제와 destroy가 가능한지 멘토님에게 물어보고 하자
  deletePostWithImage = async(req, res, next) => {
    const { postId } = req.params
    const { userId } = res.locals.user
    
    try {
      // 게시글 삭제 권한 확인
      const confrimRight = await this.postService.confrimRight(postId, userId)

      // 권한이 없다면 errorMessage
      if (!confrimRight) {
        throw new CustomError('삭제 권한이 없습니다.', 403)
      }

      // 게시글 삭제
      const deletePostWithImage = await this.postService.deletePostWithImage(
        postId,
        userId
      )
      
      // 게시글 삭제 실패 시 error
      if (!deletePostWithImage) {
        throw new CustomError('게시물 삭제 실패했습니다.', 500)
      }

      res.status(200).json({ message: '게시물 삭제에 성공했습니다.'})
    } catch (err) {
      next(err)
    }
  };
};


module.exports = PostController

