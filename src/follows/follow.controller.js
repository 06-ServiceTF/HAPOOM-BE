const FollowService = require('./follow.service');

class FollowController {
  constructor() {
    this.followService = new FollowService();
  }

  follow = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { email, method } = req.user;
      const follow = await this.followService.follow(userId, email, method);
      return res.status(200).json({ follow });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  unfollow = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { email, method } = req.user;
      const unfollow = await this.followService.unfollow(userId, email, method);
      return res.status(200).json({ unfollow });
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
