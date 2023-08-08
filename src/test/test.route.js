const express = require('express');
const axios = require("axios");
const router = express.Router();

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

module.exports = router;
