const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { Users } = require("../models");

module.exports = function initializeLocalPassport (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await Users.findOne({ where: { email } });
          if (!user) {
            return done(null, false, {
              errorMessage: "해당 이메일의 사용자를 찾을 수 없습니다",
            });
          }
          // 유저를 이메일로 찾지 못한 경우 done 호출,

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, {
              errorMessage: "비밀번호가 일치하지 않습니다..",
            });
            // 찾은 경우 bcrypt.compare로 비밀번호 비교 > 암호 불일치 시 다시 done 함수로 false 반환
          }

          return done(null, user);
          // 암호가 일치하면 done 함수로 user 객체를 반환
        } catch (err) {
          console.log(err);
          return done(err);
        }
      }
    )
  );


  // 세션에 사용자 정보 저장
  passport.serializeUser((user, done) => {
    done(null, user.userId);
  });

  // 세션에 저장된 사용자 정보 불러오기
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Users.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
