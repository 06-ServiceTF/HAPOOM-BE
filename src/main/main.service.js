const MainRepository = require('./main.repository');

class MainService {
  mainRepository = new MainRepository();

  getMain = async () => {
    const findPosts = await this.mainRepository.getMain();
    const getPosts = findPosts.map((post) => {
      return {
        postId: post.postId,
        userId: post.userId,
        nickname: post.User.nickname,
        // content: post.content,
        // latitude: post.latitude,
        // longitude: post.longitude,
        private: post.private,
        tag: post.tag,
        // musicTitle: post.musicTitle,
        // musicUrl: post.musicUrl,
        // placeName: post.placeName,
        // createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        image: post.Images[0].url,
      };
    });

    const findLikedPosts = await this.mainRepository.getMainLiked();
    const getLikedPosts = findLikedPosts.map((post) => {
      return {
        postId: post.postId,
        userId: post.userId,
        nickname: post.User.nickname,
        // content: post.content,
        // latitude: post.latitude,
        // longitude: post.longitude,
        private: post.private,
        tag: post.tag,
        // musicTitle: post.musicTitle,
        // musicUrl: post.musicUrl,
        // placeName: post.placeName,
        // createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        image: post.Images[0].url,
        // likesCount: post.likesCount,
      };
    });

    return {
      getPosts,
      getLikedPosts,
    };
  };
}

module.exports = MainService;
