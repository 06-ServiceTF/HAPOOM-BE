const MainRepository = require('./main.repository');

class MainService {
  mainRepository = new MainRepository();

  getMain = async () => {
    const findPosts = await this.mainRepository.getMain();
    const getPosts = findPosts.map((post) => {
      return {
        postId: post.postId,
        nickname: post.User.nickname,
        private: post.private,
        tag: post.tag,
        updatedAt: post.updatedAt,
        image: post.Images[0].url,
      };
    });

    const findLikedPosts = await this.mainRepository.getMainLiked();
    const getLikedPosts = findLikedPosts.map((post) => {
      return {
        postId: post.postId,
        nickname: post.User.nickname,
        private: post.private,
        tag: post.tag,
        updatedAt: post.updatedAt,
        image: post.Images[0].url,
      };
    });

    return {
      getPosts,
      getLikedPosts,
    };
  };
}

module.exports = MainService;
