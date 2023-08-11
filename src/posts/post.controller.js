const PostService = require('./post.service')

class PostController {
  postService = new PostService()

  // 게시글 생성(완료)
  createPostWithImage = async (req, res, next) => {
    // placeName값이 없다면 어떻게 되지?
    // const { content, musicTitle, musicUrl, tag, latitude, longitude, placeName  } = req.body
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
    //       location: 'https://your-bucket-name.s3.amazonaws.com/uploads/image1_1.jpg', // S3 주소
    //       etag: '"abcdefgh1234567890"',
    //       versionId: undefined
    //     }
    //   ],
    //   image2: [...], // 이하 동일한 구조로 나머지 이미지들이 배열에 담겨 있을 것입니다.
    //   image3: [...]
    // }

    try {
      const createPostWithImage = await this.postService.createPostWithImage({
        userId,
        images,
        content,
        // musicTitle, //2차 mvp
        // musicUrl, // 2차 mvp
        // tag, // 2차 mvp
        latitude,
        longitude,
        placeName
      })

      res.status(201).json({message: '게시글 작성되었습니다.'})
    } catch (err) {
      next(err)
    }
  };

  //* 상세 게시글 조회(완료)
  findPostWithImage = async (req, res, next) => {
    const { postId } = req.params
    try {
      // auth.middleware에서 값을 받아야 함
      let { userId } = res.locals.user
      
      const findPostWithImage = await this.postService.findPostWithImage(postId, userId)
      
      // 선택한 게시글이 없을 때
      if (!findPostWithImage) {
        return res.status(404).json({ errorMessage: '선택하신 게시글이 없습니다.'})
      }

      res.status(200).json({findPostWithImage})
    } catch (err) {
      next(err)
    }
  };

  //* 상세 게시글 수정
  updatePostWithImage = async (req, res, next) => {
    const { content, latitude, longitude, placeName } = req.body
    const { postId } = req.params
    const images = req.files
    const { userId } = res.locals.user

    try {
      const updatePostWithImage = this.postService.updatePostWithImage( // {updatePost, updateImage}
        postId,
        content,
        latitude,
        longitude,
        placeName,
        images,
        userId
      )

      if(!updatePostWithImage.updatePost.length) {
        res.status(500).json({ errorMessage: '수정에 실패하였습니다.'})
      }

      res.status(200).json({ message: '게시글이 수정되었습니다.'})
    } catch (err) {
      next(err)
    }
  };

  //* 상세 게시글 삭제(완료)
  deletePostWithImage = async (req, res, next) => {
    const { userId } = res.locals.user
    const { postId } = req.params

    try {
      // 게시글 삭제
      const deletePostWithImage = await this.postService.deletePostWithImage(
        postId,
        userId
      )

      // 삭제 권한이 없을 때, 로그인한 userId와 Posts.userId가 일치하지 않을 때
      const findPostUserId = await this.postService.findPostUserId(userId)
      if (!findPostUserId) {
        return res.status(403).json({ errorMessage: '삭제 권한이 없습니다.'})
      }

      // deletePostWithImage가 실패했을때
      if (deletePostWithImage !== 1) {
        return res.status(500).json({ errorMessage: '게시물 삭제에 실패했습니다.'})
      }

      res.status(200).json({ message: '게시글이 삭제되었습니다.'})
    } catch (err) {
      next(err)
    }
  };
};


module.exports = PostController

