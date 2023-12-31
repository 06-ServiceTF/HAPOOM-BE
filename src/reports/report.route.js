const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const ReportController = require('./report.controller');
const reportController = new ReportController();

// 신고하기
router.post('/:postId', authMiddleware, reportController.addReport);

module.exports = router;
