// services/testService.js
const TestRepository = require('../test/test.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require("axios");
require('dotenv').config();

class TestService {
  constructor() {
    this.testRepository = new TestRepository();
  }

  findUserByEmail = async (email) => {
    const user = await this.testRepository.findUserByEmail(email);
    const userResponse = user.get({ plain: true });
    delete userResponse.password;
    return { email: userResponse.email, nickname: userResponse.nickname };
  };

  refreshToken = async (email) => {
    const payload = {
      email,
      exp: Math.floor(Date.now() / 1000) + (60 * 30),
    };
    return jwt.sign(payload, process.env.JWT_SECRET);
  };

  findUserByEmailWithoutPassword = async (email) => {
    return this.testRepository.findUserByEmailWithoutPassword(email);
  };

  findAllUsers = async () => {
    return this.testRepository.findAllUsers();
  };

  createUser = async (email, nickname, password) => {
    const exUser = await this.testRepository.findUserByEmail(email);
    if (exUser) {
      throw new Error("이미 사용중인 아이디입니다");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.testRepository.createUser({
      email,
      nickname,
      password: hashedPassword,
      method: 'direct',
    });
    const userResponse = user.get({ plain: true });
    delete userResponse.password;
    return { email: userResponse.email, nickname: userResponse.nickname };
  };

  updateNickname = async (email, nickname) => {
    return this.testRepository.updateUserNickname(email, nickname);
  };

  deleteUser = async (email) => {
    return this.testRepository.deleteUserByEmail(email);
  };

  createPost = async (req) => {
    const images = req.files;
    const { content, musicTitle, musicUrl, tag, latitude, longitude, placeName } = req.body;
    const userId = "1";

    const post = await this.testRepository.createPost({
      content, musicTitle, musicUrl, latitude, longitude, placeName, tag, userId
    });

    await this.testRepository.createImages(images, post.dataValues.id, userId, req);
  };

  getPost = async (postId) => {
    const post = await this.testRepository.findPostById(postId);
    const images = await this.testRepository.findImagesByPostId(postId);

    if (!post) {
      throw new Error('Post not found');
    }

    return {post, images};
  };

  toggleLike = async (postId) => {
    return await this.testRepository.toggleLike(postId);
  };

  toggleReport = async (postId) => {
    return await this.testRepository.toggleReport(postId);
  };

  youtubeSearch = async function(term) {
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

    return items;
  };

  reverseGeocode = async function(x, y) {
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
    return response.data;
  };

  getMainData = function() {
    const posts = Array.from({length: 12}).map((_, id) => ({
      id: id + 1,
      content: "ㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㅇ",
      musicTitle: "버즈(Buzz) - 가시 [가사/Lyrics]",
      musicUrl: "https://www.youtube.com/watch?v=1-Lm2LUR8Ss",
      tag: "도라에몽, 펀치",
      placeName: "전라남도 완도군 완도읍 신기길 56 3 ",
      latitude: 126.742,
      longitude: 34.3275,
      private: false,
      createdAt: "2023-08-03T07:51:46.000Z",
      updatedAt: "2023-08-03T07:51:46.000Z",
      userId: 1,
      image: {
        url: "https://avatars.githubusercontent.com/u/32028454?v=4"
      }
    }));
    const likePosts = Array.from({length: 5}).map((_, id) => ({
      id: id + 1,
      content: "ㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㅇ",
      musicTitle: "버즈(Buzz) - 가시 [가사/Lyrics]",
      musicUrl: "https://www.youtube.com/watch?v=1-Lm2LUR8Ss",
      tag: "도라에몽, 펀치",
      placeName: "전라남도 완도군 완도읍 신기길 56 3 ",
      latitude: 126.742,
      longitude: 34.3275,
      private: false,
      createdAt: "2023-08-03T07:51:46.000Z",
      updatedAt: "2023-08-03T07:51:46.000Z",
      userId: 1,
      image: {
        url: "https://avatars.githubusercontent.com/u/32028454?v=4"
      }
    }));

    return {posts, likePosts};
  }
}

module.exports = TestService;
