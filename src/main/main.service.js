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

    const findMainTags = await this.mainRepository.getMainTags();
    const getMainTags = await findMainTags.map((post) => {
      return {
        postId: post.postId,
        private: post.private,
        image: post.Images[0].url,
        tagId: post.Tags[0]?.tagId,
        tag: post.Tags[0]?.tag,
      };
    });

    return {
      getPosts,
      getLikedPosts,
      getMainTags,
    };
  };

  getFeed = async (page) => {
    const findFeed = await this.mainRepository.getFeed(page);
    const getFeed = findFeed.map((feed) => {
      return {
        userId: feed.userId,
        postId: feed.postId,
        email: feed.User.email,
        nickname: feed.User.nickname,
        userImage: feed.User.userImage,
        updatedAt: feed.updatedAt,
        image: feed.Images[0].url,
        musicTitle: feed.musicTitle,
        musicUrl: feed.musicUrl,
        preset: feed.User.preset,
        content: feed.content,
        tags: feed.Tags.map((tag) => tag.tag),
      };
    });

    return {
      getFeed,
    };
  };
}

module.exports = MainService;
