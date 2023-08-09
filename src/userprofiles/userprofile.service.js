const UserprofileRepository = require('./userprofile.repository');

class UserprofileService {
  userprofileRepository = new UserprofileRepository();

  userprofile = async (userId, loggedInUserId) => {
    const findPosts = await this.userprofileRepository.userPosts(userId, loggedInUserId);
    const userPosts = findPosts.map((post) => {
      return {
        postId: post.postId,
        userId: post.userId,
        nickname: post.User.nickname,
        content: post.content,
        latitude: post.latitude,
        longitude: post.longitude,
        private: post.private,
        tag: post.tag,
        musicTitle: post.musicTitle,
        musicUrl: post.musicUrl,
        placeName: post.placeName,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        image: post.Images[0].url,
      };
    });

    // const userLikedPosts = await this.userprofileRepository.userLikedPosts(userId);
    
    const findLikedPosts = await this.userprofileRepository.userLikedPosts(userId);
    const userLikedPosts = findLikedPosts.map((post) => {
      return {
        postId: post.postId,
        userId: post.userId,
        nickname: post.User.nickname,
        content: post.content,
        latitude: post.latitude,
        longitude: post.longitude,
        private: post.private,
        tag: post.tag,
        musicTitle: post.musicTitle,
        musicUrl: post.musicUrl,
        placeName: post.placeName,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        image: post.Images[0].url,
      };
    });

    return {
      userPosts,
      userLikedPosts,
    };
  };
}

module.exports = UserprofileService;
