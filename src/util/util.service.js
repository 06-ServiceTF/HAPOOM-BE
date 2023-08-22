const axios = require('axios');
const repository = require('./util.repository');
const dotenv = require("dotenv");
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

    console.log('Response:', response.data); // 응답 전체 내용 출력

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

exports.createDummyData = async () => {
  await repository.createDummyData();
};
