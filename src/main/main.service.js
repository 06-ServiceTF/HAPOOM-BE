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
        updatedAt: post.updatedAt,
        image: post.Images[0].url,
      };
    });

    const findMainTags = await this.mainRepository.getMainTags()
    const getMainTags = await findMainTags.map((post) => {
      return {
        postId: post.postId,
        nickname: post.User.nickname,
        private: post.private,
        image: post.Images[0].url,

      }
    })

    return {
      getPosts,
      getLikedPosts,
      getMainTags
    };
  };
}

module.exports = MainService;