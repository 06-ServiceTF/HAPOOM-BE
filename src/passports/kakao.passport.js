const passport = require("passport");
const KaKaoStrategy = require("passport-kakao").Strategy;
const { Users } = require("../models");

require("dotenv").config();

module.exports = function initializeKakaoPassport (passport) {
    passport.use(
      new KaKaoStrategy(
        {
          clientID: process.env.KAKAO_CLIENT_ID,
          callbackURL: `https://hapoom-fe.vercel.app/api/auth/kakao/callback`,
          passReqToCallback: true,
        },
        function (request, accessToken, refreshToken, profile, done) {
          return done(null, profile);
        }
      )
  );

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
}