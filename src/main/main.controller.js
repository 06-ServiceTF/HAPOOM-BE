const MainService = require('./main.service');

class MainController {
  mainService = new MainService();

  getMain = async (req, res, next) => {
    try {
      const mainPage = await this.mainService.getMain();

      res.status(200).json({
        getPosts: mainPage.getPosts,
        getLikedPosts: mainPage.getLikedPosts,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = MainController;
