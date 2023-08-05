const express = require('express');
const router = express.Router();

const UserprofileController = require('./userprofile.controller');
const userprofileController = new UserprofileController();

router.get('/:userId', userprofileController.userprofile);

module.exports = router;
