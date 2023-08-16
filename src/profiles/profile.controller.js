const ProfileService = require('./profile.service');

class ProfileController {
  profileService = new ProfileService();

  // 유저 정보 조회
  userInfo = async (req, res, next) => {
    try {
      const { email, method } = req.user;
      const user = await this.profileService.userInfo(email, method);
      return res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // 유저 정보 수정
  updateUser = async (req, res) => {
    try {
      //console.log(req)
      const host = req.protocol + '://' + req.get('host');
      const userUpdates = await this.profileService.updateUser(
        req.cookies.refreshToken,
        req.files,
        req.body,
        host
      );

      res.send({ user: userUpdates });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send({ error: 'Error updating user' });
    }
  };

  // 마이페이지 조회
  myProfile = async (req, res, next) => {
    try {
      const { email, method } = req.user;
      const myProfile = await this.profileService.myProfile(email, method);
      res.status(200).json({
        user: myProfile.findUser,
        postsCount: myProfile.postsCount,
        likePostsCount: myProfile.likePostsCount,
        posts: myProfile.myPosts,
        likedPosts: myProfile.myLikedPosts,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // 유저페이지 조회
  userProfile = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const profilePage = await this.profileService.userProfile(userId);

      res.status(200).json({
        user: profilePage.getUser,
        postsCount: profilePage.userPostsCount,
        likePostsCount: profilePage.userLikePostsCount,
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
