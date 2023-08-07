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
}

module.exports = TestController;
