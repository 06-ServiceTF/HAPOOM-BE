const express = require('express');
const router = express.Router();
const controller = require('./util.controller');

router.get('/youtube/search', controller.youtubeSearch);
router.get('/map/reversegeocode', controller.reverseGeocode);
router.get('/map/geocode', controller.Geocode);
router.get('/dummy', controller.createDummy);

module.exports = router;