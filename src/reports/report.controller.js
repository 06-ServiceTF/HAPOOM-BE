const ReportService = require('./report.service');

class ReportController {
  reportService = new ReportService();

  addReport = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { email } = req.user;
      const addReport = await this.reportService.addReport(postId, email);
      return res.status(201).json({ message: '이 글을 신고하였습니다.' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = ReportController;
