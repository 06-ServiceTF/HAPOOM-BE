const express = require('express');
const router = express.Router();

const mainRouter = require('../main/main.route')

// 메인화면 관련
router.use('/main', mainRouter)

module.exports = router;
