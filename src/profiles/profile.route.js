const express = require('express');
const router = express.Router();

const UserprofileController = require('./profile.controller');
const userprofileController = new UserprofileController();

router.get('/profile/:userId', userprofileController.userprofile);

module.exports = router;
