const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require("axios");
const fs = require('fs');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { Posts, Users, Likes, Images,Comments,Reports,sequelize, Sequelize } = require('../models');
const bcrypt = require("bcrypt");

const uploadDir = './uploads/';

// 디렉토리가 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // 업로드할 디렉토리 설정
  },
  filename: function (req, file, cb) {
    const now = new Date().toISOString();
    const date = now.replace(/:/g, '-'); // ':' 문자를 '-' 문자로 대체
    cb(null, date + file.originalname); // 저장될 파일명 설정
  }
});

const upload = multer({storage: storage});

dotenv.config();

//게시글 쓰기
router.post('/post', upload.array('image', 5), async (req, res) => {
  const images = req.files;
  const { content, musicTitle, musicUrl, tag, latitude, longitude, placeName } = req.body;
  try {
    const token = req.cookies.refreshToken;
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await Users.findOne({ email: decoded.email });

    console.log(tag)

    const post = await Posts.create({
      content,
      musicTitle,
      musicUrl,
      latitude,
      longitude,
      placeName,
      private:false,
      tag,
      userId: user.dataValues.userId
    });
    console.log(images)

    console.log(post.dataValues.postId)

    const imagePromises = images.map((image) => {
      return Images.create({
        url: req.protocol + '://' + req.get('host') + '/' + image.path, // 파일 경로를 URL로 변환
        postId: post.dataValues.postId,
        userId: user.dataValues.userId
      });
    });

    await Promise.all(imagePromises);

    res.status(200).send({ message: 'Post received' });
  } catch(err) {
    console.error(err);
    res.status(500).send({ error: 'Error creating post' });
  }
});

//유저정보 가져오기
router.get('/user', async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await Users.findOne({ email: decoded.email }, { password: 0 }); // 패스워드 필드를 제외

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.send({user});

  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).send({ error: 'Error getting user' });
  }
});

//유저 프로필 페이지
router.get('/user/profile', async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await Users.findOne({
      where: { email: decoded.email },
      attributes: { exclude: ['password'] }, // 패스워드 필드를 제외
    });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // user의 userId를 가진 모든 post들을 찾음
    const posts = await Posts.findAll({
      where: { userId: user.userId },
    });

    // user가 like한 모든 post들을 찾음
    // Likes 테이블에서 userId가 일치하는 모든 postId를 찾고, 그 postId들을 가진 post들을 찾아옴
    const likePostIds = await Likes.findAll({
      where: { userId: user.userId },
      attributes: ['postId'],
    });
    const likePosts = await Posts.findAll({
      where: { postId: likePostIds.map(lp => lp.postId) },
    });

    // 해당 유저가 작성한 게시물의 수
    const postsCount = await Posts.count({
      where: { userId: user.userId },
    });

    // 해당 유저가 좋아요를 누른 게시물의 수
    const likePostsCount = await Likes.count({
      where: { userId: user.userId },
    });

    res.send({ user, posts, likePosts , postsCount , likePostsCount});

  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).send({ error: 'Error getting user' });
  }
});

//유저 정보 수정[세팅페이지]
router.patch('/user', upload.single('image'), async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // DB에서 사용자를 찾음
    const user = await Users.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    if (req.file) {
      const imageUrl = req.protocol + '://' + req.get('host') + '/' + req.file.path; // 파일 경로를 URL로 변환
      user.userImage = imageUrl; // userImage 필드에 URL 저장
    }

    console.log('리퀘스트 바디 값 :', req.body);

    const updates = Object.keys(req.body);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.send({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send({ error: 'Error updating user' });
  }
});

//postId의 모든 댓글 들고오기
router.get('/post/comments/:postId', async (req, res) => {
  try {
    const comments = await Comments.findAll({ postId: req.params.postId });
    res.send({ comments });
  } catch (error) {
    console.error('Error get comments:', error);
    res.status(500).send({ error: 'Error get comments' });
  }
});

//postId 게시글에 댓글 작성하기
router.post('/post/comment', async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // DB에서 사용자를 찾음
    const user = await Users.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    const comment = await Comments.create({
      content: req.body.content,
      userId: user.dataValues.userId,
      postId: req.body.postId
    });
    res.status(200);
  } catch (error) {
    console.error('Error get comments:', error);
    res.status(500).send({ error: 'Error get comments' });
  }
});

//게시글 상세보기
router.get('/post/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Posts.findOne({
      where: {
        postId: postId
      }
    });

    const images = await Images.findAll({
      where: {
        postId: postId
      }
    });

    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    res.send({post,images});

  } catch (error) {
    console.error('Error getting post:', error);
    res.status(500).send({ error: 'Error getting post' });
  }
});

// 좋아요 토글 api
router.post('/post/:postId/like', async (req, res) => {
  const { postId } = req.params; // URL 파라미터에서 postId를 추출
  const token = req.cookies.refreshToken;
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  // DB에서 사용자를 찾음
  const user = await Users.findOne({ email: decoded.email });
  const userId = user.dataValues.userId; // userId 값을 추출

  const like = await Likes.findOne({ where: { userId, postId } });

  if (like) {
    await like.destroy();
    res.json({ message: 'Like removed.' });
  } else {
    await Likes.create({ userId, postId });
    res.json({ message: 'Like added.' });
  }
});

// 신고 토글 API
router.post('/report/:postId', async (req, res) => {
  //const { userId } = req.body; // 요청 본문에서 userId를 추출
  const { postId } = req.params; // URL 파라미터에서 postId를 추출
  const token = req.cookies.refreshToken;
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  // DB에서 사용자를 찾음
  const user = await Users.findOne({ email: decoded.email });
  const userId = user.dataValues.userId; // userId 값을 추출

  const report = await Reports.findOne({ where: { userId, postId } });

  if (report) {
    await report.destroy();
    res.json({ message: 'Report removed.' });
  } else {
    await Reports.create({ userId, postId });
    res.json({ message: 'Report added.' });
  }
});

// 게시글 수정기능
router.put('/post/:postId', upload.array('image', 5), async (req, res) => {
  const images = req.files;
  const { content, musicTitle, musicUrl, tag, latitude, longitude, placeName } = req.body;
  const postId = req.params.postId;

  try {
    // Find the existing post
    const post = await Posts.findByPk(postId);

    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    // Update the post
    await post.update({
      content,
      musicTitle,
      musicUrl,
      latitude,
      longitude,
      placeName,
      private:false,
      tag
    });

    // Delete old images
    await Images.destroy({
      where: {
        postId: postId
      }
    });

    // Add new images
    const imagePromises = images.map((image) => {
      return Images.create({
        url: req.protocol + '://' + req.get('host') + '/' + image.path, // 파일 경로를 URL로 변환
        postId: postId,
        userId: post.dataValues.userId
      });
    });

    await Promise.all(imagePromises);

    res.status(200).send({ message: 'Post updated' });
  } catch(err) {
    console.error(err);
    res.status(500).send({ error: 'Error updating post' });
  }
});

// youtube api
router.get('/youtube/search', async (req, res) => {
  const { term } = req.query;
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: 'snippet',
        maxResults: 5,
        key: process.env.YOUTUBE_API_KEY,
        q: term,
        type: 'video',
      },
    });

    const items = response.data.items.map(item => {
      return {
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.default.url,
      };
    });

    res.send(items);
  } catch (error) {
    console.error('Error searching YouTube:', error);
    res.status(500).send({ error: 'Error searching YouTube' });
  }
});

// 지도 api
router.get('/map/reversegeocode', async (req, res) => {
  const { x, y } = req.query;
  try {
    const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc', {
      params: {
        coords: `${x},${y}`,
        orders: 'roadaddr',
        output: 'json',
      },
      headers: {
        'X-NCP-APIGW-API-KEY-ID': `${process.env.R_GEO_API_KEY}`,
        'X-NCP-APIGW-API-KEY': `${process.env.R_GEO_API_SECRET_KEY}`,
      },
    });
    res.send(response.data);
  } catch (error) {
    console.error('Error getting geocode:', error);
    res.status(500).send({ error: 'Error getting geocode' });
  }
});

//더미생성 api
router.get('/dummy', async (req, res) => {
  try {
    // 10명의 유저 생성
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

      // 생성된 유저당 2개의 게시물 생성
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

        console.log(post.id,post.dataValues)
        await Images.create({
          url: 'https://avatars.githubusercontent.com/u/32028454?v=4',
          postId: post.postId, // 여기를 올바르게 참조
          userId: post.dataValues.userId
        });
      }
    }

    res.status(200).send('Test Data Created Successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while creating test data');
  }
});

module.exports = router;
