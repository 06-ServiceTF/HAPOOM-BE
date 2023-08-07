const { RegisterService, LoginService } = require("../auth/auth.service");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class LoginController {
    loginService = new LoginService();
  
    loginUser = async (req, res, next) => {
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          console.log(err);
          next(err);
        }
        if (!user) {
          return res.status(401).json({ errorMessage: info.errorMessage });
        }
  
        req.logIn(user, (err) => {
          if (err) {
            console.log(err);
            return next(err);
          }
  
          const token = jwt.sign(
            { userId: user.userId },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
  
          res.cookie("cowdog", `Bearer ${token}`);
  
          return res.status(200).json({ message: "로그인 성공", token });
        });
      })(req, res, next);
    };
  }

class RegisterController {
  registerService = new RegisterService();

  registerUser = async (req, res, next) => {
    try {
      const { email, nickname, password, confirm } = req.body; // registerValidation 정의 필요
      const existUser = await this.registerService.findUser(email);
  
      const salt = bcrypt.genSaltSync(8); // 오타 수정: saltSync -> genSaltSync
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      const user = await this.registerService.createUser(
        email,
        nickname,
        hashedPassword
      );
  
      return res.status(201).json({ message: "회원가입을 완료하였습니다." });
    } catch (error) {
      console.log(error);
      return res.status(409).json({ errorMessage: error.message });
    }
  };
}



module.exports = {
    RegisterController,
    LoginController,
};

