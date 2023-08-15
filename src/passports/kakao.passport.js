const passport = require("passport");
const KaKaoStrategy = require("passport-kakao").Strategy;
const { Users } = require("../models");

require("dotenv").config();

module.exports = function initializeKakaoPassport (passport) {
    passport.use(
      new KaKaoStrategy(
        {
          clientID: process.env.KAKAO_CLIENT_ID,
          callbackURL: `${process.env.ORIGIN_BACK}/user/kakao/callback`,
          passReqToCallback: true,
        },
        function (request, accessToken, refreshToken, profile, done) {
          return done(null, profile);
        }
      )
  );
};