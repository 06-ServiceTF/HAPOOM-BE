const ReportRepository = require('./report.repository');
const CustomError = require('../middlewares/error.middleware');

class ReportService {
  reportRepository = new ReportRepository();

  addReport = async (postId, email, method) => {
    // 게시글 존재 여부 확인
    const postExists = await this.reportRepository.checkPostExists(postId);
    if (!postExists) throw new CustomError('게시글이 존재하지 않습니다.', 404);

    // 게시글 작성자 조회
    const postAuthor = await this.reportRepository.getPostAuthor(postId);

    // 현재 사용자 조회
    const currentUser = await this.reportRepository.getCurrentUser(
      email,
      method
    );

    // 게시글 작성자와 현재 사용자가 동일한 경우 신고 막기 
    if (postAuthor.userId === currentUser.userId)
      throw new CustomError('자신을 신고할 수 없습니다.', 401);

    // 중복 신고 여부 확인
    const existingReport = await this.reportRepository.getReport(
      postId,
      email,
      method
    );
    if (existingReport) throw new CustomError('이미 신고한 글입니다.', 409);

    const addedReport = await this.reportRepository.addReport(
      postId,
      email,
      method
    );
    return addedReport;
  };
}

module.exports = ReportService;
