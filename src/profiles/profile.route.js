const express = require('express');
const router = express.Router();

const ProfileController = require('./profile.controller');
const profileController = new ProfileController();

router.get('/', profileController.userInfo)
router.patch('/', profileController.updateInfo)
router.get('/profile/:userId', profileController.userprofile);

module.exports = router;
