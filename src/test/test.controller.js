const TestService = require("./test.service");

class TestController {
  testService = new TestService();

  getUserToken = async (req, res) => {
    try {
      const userResponse = await this.testService.findUserByEmail(req.user.email);
      res.status(200).json(userResponse);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  refreshToken = async (req, res) => {
    try {
      const token = await this.testService.refreshToken(req.user.email);
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).send(error);
    }
  };

  getUserByEmail = async (req, res) => {
    try {
      const user = await this.testService.findUserByEmailWithoutPassword(req.params.email);
      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const users = await this.testService.findAllUsers();
      res.send(users);
    } catch (error) {
      res.status(500).send(error);
      console.error(error)
    }
  };

  signup = async (req, res, next) => {
    try {
      const userResponse = await this.testService.createUser(req.body.email, req.body.nickname, req.body.password);
      res.json(userResponse);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  login = async (req, res, next) => {
    // Login logic here...
  };

  logout = async (req, res, next) => {
    // Logout logic here...
  };

  updateNickname = async (req, res) => {
    try {
      const user = await this.testService.updateNickname(req.params.email, req.body.nickname);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  deleteUser = async (req, res) => {
    try {
      await this.testService.deleteUser(req.params.email);
      res.json({ message: "User successfully deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  createPost = async (req, res) => {
    try {
      await this.testService.createPost(req);
      res.status(200).send({ message: 'Post received' });
    } catch(err) {
      console.error(err);
      res.status(500).send({ error: 'Error creating post' });
    }
  };

  getPost = async (req, res) => {
    try {
      const postAndImages = await this.testService.getPost(req.params.postId);
      res.send(postAndImages);
    } catch (error) {
      console.error('Error getting post:', error);
      res.status(500).send({ error: 'Error getting post' });
    }
  };

  toggleLike = async (req, res) => {
    try {
      const message = await this.testService.toggleLike(req.params.postId);
      res.json({ message });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ error });
    }
  };

  toggleReport = async (req, res) => {
    try {
      const message = await this.testService.toggleReport(req.params.postId);
      res.json({ message });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ error });
    }
  };

  updatePost = async (req, res) => {
    try {
      await this.testService.updatePost(req);
      res.status(200).send({ message: 'Post updated' });
    } catch(err) {
      console.error(err);
      res.status(500).send({ error: 'Error updating post' });
    }
  };

  youtubeSearch = async (req, res) => {
    const { term } = req.query;
    try {
      const items = await this.testService.youtubeSearch(term);
      res.send(items);
    } catch (error) {
      console.error('Error searching YouTube:', error);
      res.status(500).send({ error: 'Error searching YouTube' });
    }
  };

  reverseGeocode = async (req, res) => {
    const { x, y } = req.query;
    try {
      const response = await this.testService.reverseGeocode(x, y);
      res.send(response.data);
    } catch (error) {
      console.error('Error getting geocode:', error);
      res.status(500).send({ error: 'Error getting geocode' });
    }
  };

  getMainData = async (req,res) => {
    try {
      const {posts,likePosts} = this.testService.getMainData();
      console.log(posts,likePosts);

      res.send({posts,likePosts});
    } catch (error) {
      throw new Error('Error getting main data');
    }
  };
}

module.exports = TestController;
