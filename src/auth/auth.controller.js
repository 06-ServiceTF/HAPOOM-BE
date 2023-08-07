const authService = require('./authService');
const passport = require("passport");

class AuthController {
  async getUserToken(req, res, next) {
    try {
      const userResponse = await authService.getUserToken(req.user.email);
      res.status(200).json(userResponse);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const token = await authService.refreshToken(req.user.email);
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  async signup(req, res, next) {
    try {
      const userResponse = await authService.signup(req.body);
      res.json(userResponse);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    passport.authenticate('local', async (err, user, info) => {
      try {
        if (err) {
          console.log(err);
          return next(err);
        }
        if (info) {
          return res.status(401).send(info.message);
        }
        const { userResponse, token } = await authService.login(req, user);
        res.status(200).json({ userResponse, token });
      } catch (error) {
        console.log(err);
        return next(error);
      }
    })(req, res, next);
  }

  async logout(req, res, next) {
    req.logout(() => {
      req.session.destroy();
      res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true, sameSite: 'None', secure: true });
      res.send("ok");
    });
  }
}

module.exports = new AuthController();
