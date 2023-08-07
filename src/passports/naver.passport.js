const passport = require("passport");
const NaverStrategy = require("passport-naver").Strategy;
const { Users } = require("../models");

require("dotenv").config();

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      callbackURL: process.env.NAVER_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        const existUser = await Users.findOne({
          where: { naverId: profile.id },
        });

        if (existUser) {
          done(null, existUser);
        } else {
          const newUser = await Users.create({
            email: profile.emails[0].value,
            displayName: profile.displayName,
            naverId: profile.id,
            profileImageUrl: profile._json.profile_image,
            providerType: "naver",
          });
          done(null, newUser);
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
