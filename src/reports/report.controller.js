const ReportService = require('./report.service');

class ReportController {
  reportService = new ReportService();

  // 신고하기
  addReport = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { email, method } = req.user;

      // 게시글 작성자와 신고하는 사용자가 동일한 경우 신고 막기
      const isSelfReport = await this.reportService.isSelfReport(
        postId,
        email,
        method
      );
      if (isSelfReport) {
        return res.status(400).json({ message: '자신을 신고할 수 없습니다.' });
      }

      const addReport = await this.reportService.addReport(
        postId,
        email,
        method
      );
      return res.status(201).json({ message: '이 글을 신고하였습니다.' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = ReportController;
