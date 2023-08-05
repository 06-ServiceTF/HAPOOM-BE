const UserprofileService = require('./userprofile.service');

class UserprofileController {
  userprofileService = new UserprofileService();

  userprofile = async (req, res, next) => {
    try {
      const targetUserId = req.params.userId
      const userprofilePage = await this.userprofileService.userprofile(targetUserId);

      res.status(200).json({
        posts: userprofilePage.userPosts,
        likedPosts: userprofilePage.userLikedPosts,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = UserprofileController;
