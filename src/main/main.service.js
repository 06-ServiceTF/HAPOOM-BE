const MainRepository = require('./main.repository');

class MainService {
  mainRepository = new MainRepository();

  getMain = async () => {
    const getPosts = await this.mainRepository.getMain();
    const getLikedPosts = await this.mainRepository.getMainLiked();

    return {
      getPosts,
      getLikedPosts,
    };
  };
}

module.exports = MainService;