const ReportRepository = require('./report.repository');

class ReportService {
  reportRepository = new ReportRepository();

  addReport = async (postId, userId) => {
    // 한 사람이 중복 신고를 할 수 없게 신고 여부를 먼저 확인
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
