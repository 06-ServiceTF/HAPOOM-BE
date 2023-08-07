const UserprofileService = require('./userprofile.service');

class UserprofileController {
  userprofileService = new UserprofileService();

  userprofile = async (req, res, next) => {
    try {
      const targetUserId = req.params.userId;
      const loggedInUserId = req.user ? req.user.id : null;
      // loggedInUserId가 로그인한 사용자의 ID를 가지고 있으면 해당 프로필 페이지를 조회할 때, 로그인하지 않은 경우(null)에는 public 게시글만 보여지도록 설정.
      const userprofilePage = await this.userprofileService.userprofile(targetUserId, loggedInUserId);

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
