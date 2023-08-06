const { Reports } = require('../models');

class ReportRepository {
  addReport = async (postId, userId) => {
    const report = await Reports.create({ postId, userId });
    return report;
  };

  // 특정 포스트에 특정 사용자의 신고 여부 조회
  async getReport(postId, userId) {
    const report = await Reports.findOne({
      where: {
        postId,
        userId,
      },
    });
    return report;
  }
}

module.exports = ReportRepository;
