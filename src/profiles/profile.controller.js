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

  updateUser = async (req, res) => {
    try {
      const userUpdates = await this.profileService.updateUser(
        req.cookies.refreshToken,
        req.file,
        req.body
      );

      res.send({ user: userUpdates });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send({ error: 'Error updating user' });
    }
  };

  myProfile = async (req, res, next) => {
    try {
      const { email } = req.user;
      const myProfile = await this.profileService.myProfile(email);
      res.status(200).json({
        user: myProfile.findUser,
        postsCount: myProfile.postsCount,
        likePostsCount: myProfile.likePostsCount,
        posts: myProfile.userPosts,
        likedPosts: myProfile.userLikedPosts,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // userProfile = async (req, res, next) => {
  //   try {
  //     const targetUserId = req.params.userId;
  //     const loggedInUserId = req.user ? req.user.id : null;
  //     // loggedInUserId가 로그인한 사용자의 ID를 가지고 있으면 해당 프로필 페이지를 조회할 때, 로그인하지 않은 경우(null)에는 public 게시글만 보여지도록 설정.
  //     const profilePage = await this.profileService.userProfile(
  //       targetUserId,
  //       loggedInUserId
  //     );

  //     res.status(200).json({
  //       user: profilePage.findUser,
  //       postsCount: profilePage.postsCount,
  //       likePostsCount: profilePage.likePostsCount,
  //       posts: profilePage.userPosts,
  //       likedPosts: profilePage.userLikedPosts,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // };
}

module.exports = ProfileController;
