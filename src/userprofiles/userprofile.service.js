const UserprofileRepository = require('./userprofile.repository');

class UserprofileService {
  userprofileRepository = new UserprofileRepository();

  userprofile = async (userId, loggedInUserId) => {
    const userPosts = await this.userprofileRepository.userPosts(userId, loggedInUserId);
    const userLikedPosts = await this.userprofileRepository.userLikedPosts(userId);

    return {
      userPosts,
      userLikedPosts,
    };
  };
}

module.exports = UserprofileService;
