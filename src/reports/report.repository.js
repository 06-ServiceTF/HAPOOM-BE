const { Posts, Reports } = require('../models');

class ReportRepository {
  checkPostExists = async (postId) => {
    const postExists = await Posts.findOne({ where: { postId } });
    return postExists;
  };

  addReport = async (postId, email) => {
    const report = await Reports.create({ postId, email });
    return report;
  };

  // 특정 포스트에 특정 사용자의 신고 여부 조회
  getReport = async (postId, email) => {
    const report = await Reports.findOne({
      where: {
        postId,
        email,
      },
    });
    return report;
  };
}

module.exports = ReportRepository;
