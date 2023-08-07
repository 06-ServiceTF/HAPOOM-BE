const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Users } = require("../models");

require("dotenv").config();

module.exports = function initializeGooglePassport(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("Access Token: ", accessToken); // 로그 추가
          console.log("Profile: ", profile); // 로그 추가
          const existUser = await Users.findOne({
            where: { googleId: profile.id },
          });

          if (existUser) {
            console.log("User already exists: ", existUser); // 로그 추가
            done(null, existUser);
          } else {
            const newUser = await Users.create({
              email: profile.emails[0].value,
              displayName: profile.displayName,
              googleId: profile.id,
              profileImageUrl: profile.photos[0].value,
              providerType: "google",
            });
            console.log("New user created: ", newUser); // 로그 추가
            done(null, newUser);
          }
        } catch (error) {
          console.error("Error in passport use: ", error); // 에러 로그 추가
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
};
