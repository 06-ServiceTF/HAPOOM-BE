const ReportRepository = require('./report.repository');
const CustomError = require('../middlewares/error.middleware');

class ReportService {
  reportRepository = new ReportRepository();

  addReport = async (postId, userId) => {
    // 게시글 존재 여부 확인
    const postExists = await this.reportRepository.checkPostExists(postId);
    if (!postExists) throw new CustomError('게시글이 존재하지 않습니다.', 404);

    // 중복 신고 여부 확인
    const existingReport = await this.reportRepository.getReport(
      postId,
      userId
    );
    if (existingReport) throw new CustomError('이미 신고한 글입니다.', 409);

    const addedReport = await this.reportRepository.addReport(postId, userId);
    return addedReport;
  };
}

module.exports = ReportService;
