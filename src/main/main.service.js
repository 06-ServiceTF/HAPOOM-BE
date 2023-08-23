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

  getFeed = async () => {
    const findFeed = await this.mainRepository.getFeed();
    const getFeed = findFeed.map((feed) => {
      return {
        postId: feed.postId,
        email: feed.User.email,
        nickname: feed.User.nickname,
        userImage: feed.User.userImage,
        updatedAt: feed.updatedAt,
        image: feed.Images[0].url,
        musicTitle: feed.musicTitle,
        musicUrl: feed.musicUrl,
        preset: feed.User.preset,
      };
    });

    return {
      getFeed,
    };
  };
}

module.exports = MainService;
