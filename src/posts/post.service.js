const PostRepository = require('./post.repository')
// const { Images } = require('../models')

class PostService {

  postRepository = new PostRepository()

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
    placeName
  ) => {

      await this.postRepository.createPostWithImage({
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
  };

  // 게시글 상세 조회
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

  // 게시글 수정

  // 게시글 삭제
  deletePostWithImage = async (postId, userId) => {

    const deletePostWithImage 
    = await this.postRepository.deletePostWithImage(postId, userId)
  
    return deletePostWithImage
  }

};

module.exports = PostService