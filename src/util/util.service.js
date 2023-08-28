const axios = require('axios');
const webpush = require('web-push');
const repository = require('./util.repository');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const {Users} = require("../models");
dotenv.config();

exports.youtubeSearch = async (term) => {
  const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
    params: {
      part: 'snippet',
      maxResults: 5,
      key: process.env.YOUTUBE_API_KEY,
      q: term,
      type: 'video',
    },
  });

  return response.data.items.map(item => {
    return {
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
    };
  });
};

exports.Geocode = async (address, page = 1, size = 5) => {
  try {
    const response = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
      params: {
        query: address,
        page: page,
        size: size,
      },
      headers: {
        'Authorization': `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
      },
    });

    //console.log('Response:', response.data); // 응답 전체 내용 출력

    if (response.data.documents && response.data.documents.length > 0) {
      return {
        addressInfo: response.data.documents,
      };
    } else {
      console.error('No matching address found');
      return null;
    }
  } catch (error) {
    console.error('Error calling Kakao Geocode API:', error);
    return null;
  }
};

exports.reverseGeocode = async (x, y) => {
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

exports.addSubscription = async (subscription, req) => {
  try {
    const token = req.cookies.refreshToken;
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await Users.findOne({ where: { email: decoded.email, method: decoded.method } });

    if (!user) {
      throw new Error("User not found");
    }

    return await repository.create(subscription, user);
  } catch (error) {
    console.error("Error in addSubscription:", error);
    throw error; // 에러를 다시 던져서 호출하는 측에서도 처리할 수 있게 합니다.
  }
};

exports.sendNotificationToAll = async (payload) => {
  const subscriptions = await repository.findAll();
  console.log(subscriptions)
  subscriptions.forEach((subscription) => {
    webpush.sendNotification(subscription, JSON.stringify(payload));
  });
};

exports.togglePush = async (req,res) => {
  const token = req.cookies.refreshToken;
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await Users.findOne({ where: { email: decoded.email,method:decoded.method } });
  await repository.togglePush(user.userId);
  res.status(200)
};
