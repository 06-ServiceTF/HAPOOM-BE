const FollowService = require('./follow.service');

class FollowController {
  constructor() {
    this.followService = new FollowService();
  }

  // 팔로우
  follow = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { email, method } = req.user;
      const follow = await this.followService.follow(userId, email, method);
      return res.status(200).json({ message: '팔로우 성공' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // 언팔로우
  unfollow = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { email, method } = req.user;
      const unfollow = await this.followService.unfollow(userId, email, method);
      return res.status(200).json({ message: '팔로우 취소' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // 유저 팔로워 리스트
  getFollowers = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const followers = await this.followService.getFollowers(userId);
      return res.status(200).json({ followers });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // 유저 팔로잉 리스트
  getFollowing = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const following = await this.followService.getFollowing(userId);
      return res.status(200).json({ following });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = FollowController;
