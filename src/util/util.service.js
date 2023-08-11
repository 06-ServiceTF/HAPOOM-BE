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
