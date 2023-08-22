const FollowService = require('./follow.service');

class FollowController {
  constructor() {
    this.followService = new FollowService();
  }

  follow = async (req, res, next) => {
    try {
      const { userId } = req.params;
      // const { email, method } = req.user;
      const email = 'zxcv@gmail.com';
      const follow = await this.followService.follow(userId, email);
      return res.status(200).json({ message: '팔로우 성공' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  unfollow = async (req, res, next) => {
    try {
      const { userId } = req.params;
      // const { email, method } = req.user;
      const email = 'zxcv@gmail.com';
      const unfollow = await this.followService.unfollow(userId, email);
      return res.status(200).json({ message: '팔로우 취소' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

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
