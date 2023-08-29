const express = require('express');
const router = express.Router();
const controller = require('./util.controller');

router.get('/youtube/search', controller.youtubeSearch);
router.get('/map/reversegeocode', controller.reverseGeocode);
router.get('/map/geocode', controller.Geocode);
router.post('/subscribe', controller.subscribe);
router.post('/sendNotification', controller.sendNotification);
router.post('/togglepush',controller.togglePush)

module.exports = router;