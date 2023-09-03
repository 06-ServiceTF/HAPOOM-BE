const passport = require("passport");
const NaverStrategy = require("passport-naver").Strategy;
const { Users } = require("../models");

require("dotenv").config();

module.exports = function initializeNaverPassport (passport) {
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: `https://dailytodo.store/api/auth/naver/callback`,
        passReqToCallback: true,
      },
      function (request,accessToken, refreshToken, profile, done) {
        return done(null, profile);
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}