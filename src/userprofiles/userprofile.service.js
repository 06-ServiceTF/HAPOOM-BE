const UserprofileRepository = require('./userprofile.repository');

class UserprofileService {
  userprofileRepository = new UserprofileRepository();

  userprofile = async (userId) => {
    const userPosts = await this.userprofileRepository.userPosts(userId);
    const userLikedPosts = await this.userprofileRepository.userLikedPosts(userId);

    return {
      userPosts,
      userLikedPosts,
    };
  };
}

module.exports = UserprofileService;
