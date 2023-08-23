const MainService = require('./main.service');

class MainController {
  mainService = new MainService();

  getMain = async (req, res, next) => {
    try {
      const mainPage = await this.mainService.getMain();
      res.status(200).json({
        posts: mainPage.getPosts,
        likePosts: mainPage.getLikedPosts,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getFeed = async (req, res, next) => {
    try {
      const feedPage = await this.mainService.getFeed();
      res.status(200).json({
        feed: feedPage.getFeed,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = MainController;
