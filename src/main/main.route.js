const express = require('express');
const router = express.Router();

const MainController = require('./main.controller');
const mainController = new MainController();

router.get('/', mainController.getMain);
router.get('/feed', mainController.getFeed);

module.exports = router;