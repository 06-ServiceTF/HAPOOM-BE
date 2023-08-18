const { Posts, Users, Likes, Images,Comments,Reports,sequelize, Sequelize } = require('../models');
const bcrypt = require('bcrypt');

exports.createDummyData = async () => {
  const hashedPassword = await bcrypt.hash('testtest1', 12);
  const musicData = [
    { url: "https://www.youtube.com/watch?v=rgms0zs6SZc", title: "남자를몰라" },
    { url: "https://www.youtube.com/watch?v=q0Bc1lmn5fA", title: "onelove" },
    { url: "https://www.youtube.com/watch?v=FwbEtCtz8Qk", title: "please dont happy" },
    { url: "https://www.youtube.com/watch?v=4oQ2-b89a0w", title: "hello" },
    { url: "https://www.youtube.com/watch?v=1-Lm2LUR8Ss", title: "버즈(Buzz) - 가시 [가사/Lyrics]" }
  ];

  for (let i = 0; i < 10; i++) {
    const user = await Users.create({
      email: `test${i}@example.com`,
      password: hashedPassword,
      nickname: `user${i}`,
      userImage:'',
      theme:1,
      preset:5,
      method:"direct"
    });

    for (let j = 0; j < 2; j++) {
      const randomMusic = musicData[Math.floor(Math.random() * musicData.length)];
      const post = await Posts.create({
        userId: user.userId,
        content: `Test Post ${j} by user${i}`,
        private: false,
        musicTitle: randomMusic.title,
        musicUrl: randomMusic.url,
        latitude:126.742,
        longitude:34.3245,
        placeName:`전라남도 완도군 완도읍 장보고대로 103  해남소방서 완도119안전센터`,
        tag:"",
      });

      await Images.create({
        url: 'https://avatars.githubusercontent.com/u/32028454?v=4',
        postId: post.postId,
        userId: post.dataValues.userId
      });
    }
  }
};
