const { Posts, Users, Reports } = require('../models');

class ReportRepository {
  checkPostExists = async (postId) => {
    const postExists = await Posts.findOne({ where: { postId } });
    return postExists;
  };

  addReport = async (postId, email, method) => {
    const user = await Users.findOne({
      where: { email, method },
      attributes: ['userId'],
    });
    const report = await Reports.create({ postId, userId: user.userId });
    return report;
  };

  // 특정 포스트에 특정 사용자의 신고 여부 조회
  getReport = async (postId, email, method) => {
    const user = await Users.findOne({
      where: { email, method },
      attributes: ['userId'],
    });
    const report = await Reports.findOne({
      where: {
        postId,
        userId: user.userId,
      },
    });
    return report;
  };
}

module.exports = ReportRepository;
