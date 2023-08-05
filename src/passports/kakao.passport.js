const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const { Users } = require("../models");

require('dotenv').config();

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        const existUser = await Users.findOne({
          where: { kakaoId: profile.id },
        });

        if (existUser) {
          done(null, existUser);
        } else {
          const newUser = await Users.create({
            email: profile._json && profile._json.kakao_account.email,
            nickname: profile.displayName,
            kakaoId: profile.id,
            profileImgUrl:
              profile._json &&
              profile._json.kakao_account.profile.profile_image_url,
            providerType: "kakao",
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
