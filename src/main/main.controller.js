const MainService = require('./main.service');

class MainController {
  mainService = new MainService();

  getMain = async (req, res, next) => {
    try {
      const mainPage = await this.mainService.getMain();
      res.status(200).json({
        posts: mainPage.getPosts,
        likePosts: mainPage.getLikedPosts,
        mainTags: mainPage.getMainTags,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getFeed = async (req, res, next) => {
    try {
      const page = req.query.page || 1;
      const { content, totalPages, totalElements } =
        await this.mainService.getFeed(page);
      res.status(200).json({
        content,
        totalPages,
        totalElements,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = MainController;
