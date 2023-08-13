const ProfileService = require('./profile.service');

class ProfileController {
  profileService = new ProfileService();

  userInfo = async (req, res, next) => {
    try {
      const { email } = req.user;
      const user = await this.profileService.userInfo(email);
      return res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  updateInfo = async (req, res, next) => {
    try {
      const { email } = req.user;
      const imageUrl = req.file
        ? req.protocol + '://' + req.get('host') + '/' + req.file.path
        : null;

      const updateInfo = await this.profileService.updateInfo(
        email,
        req.body,
        imageUrl
      );
      return res.status(200).json({ updateInfo });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  userprofile = async (req, res, next) => {
    try {
      // const req = { params: { userId: 5 }, user: { id: 5 } }; // 테스트용
      const targetUserId = req.params.email;
      const loggedInUserId = req.user ? req.user.id : null;
      // loggedInUserId가 로그인한 사용자의 ID를 가지고 있으면 해당 프로필 페이지를 조회할 때, 로그인하지 않은 경우(null)에는 public 게시글만 보여지도록 설정.
      const profilePage = await this.profileService.userprofile(
        targetUserId,
        loggedInUserId
      );

      res.status(200).json({
        user: profilePage.findUser,
        postsCount: profilePage.postsCount,
        likePostsCount: profilePage.likePostsCount,
        posts: profilePage.userPosts,
        likedPosts: profilePage.userLikedPosts,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = ProfileController;
