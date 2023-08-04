const PostService = require('./post.service')

class PostController {
  postService = new PostService()

  createPostWithImage = async (req, res, next) => {
    // placeName값이 없다면 어떻게 되지?
    const { content, musicTitle, musicUrl, tag, latitude, longitude, placeName  } = req.body
    const { userId, nickname} = res.locals.user
    // way1. 이렇게 할 수 없으니 새로운 방법을 생각해야 함
    // 왜 이렇게 할 수가 없나? : 
    // const { image1, image2, image3, image4, image5 } = req.files

    // way2
    const images = req.files
    // images가 어떻게 생겼는지 확인 필요
    console.log(images)

    try {
      const createPostWithImage = await this.postService.createPostWithImage({
        userId,
        nickname,
        images,
        content,
        musicTitle,
        musicUrl,
        tag,
        latitude,
        longitude,
        placeName
      })

      res.status(201).json({message: '게시글 작성되었습니다.'})
    } catch (err) {
      next(err)
    }
  };

  findPostWithImage = async (req, res, next) => {
    const { postId } = req.params
    try {
      // auth.middleware에서 값을 받아야 함
      let { userId } = res.locals.user
      
      // 로그인이 안되어있을시 에러 방지
      if (!userId) {
        userId = userId || ''
      }
      
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

  updatePostWithImage = async (req, res, next) => {

  };

  deletePostWithImage = async (req, res, next) => {
    const { userId } = res.locals.user
    const { postId } = req.params

    try {
      // 로그인이 안되어있을 때
      if(!userId) return res.status().json({ errorMessage: '로그인이 필요한 기능입니다.'})
    
      const deletePostWithImage = await this.postService.deletePostWithImage(
        postId,
        userId
      )

      res.status(200).json({ message: '게시글이 삭제되었습니다.'})
    } catch (err) {
      next(err)
    }
  }


}


module.exports = PostController

