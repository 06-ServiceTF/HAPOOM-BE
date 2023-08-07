// repositories/test.repository.js
const {  Users, Posts ,Images, Reports,Likes} = require('../models');

class TestRepository {
  findUserByEmail = async (email) => {
    return Users.findOne({ where: { email } });
  };

  findUserByEmailWithoutPassword = async (email) => {
    return Users.findOne({ where: { email }, attributes: { exclude: ['password'] } });
  };

  findAllUsers = async () => {
    return Users.findAll();
  };

  createUser = async (userDetails) => {
    return Users.create(userDetails);
  };

  updateUserNickname = async (email, nickname) => {
    const user = await Users.findUserByEmail(email);
    user.nickname = nickname;
    await user.save();
    return user;
  };

  deleteUserByEmail = async (email) => {
    const user = await Users.findUserByEmail(email);
    await user.destroy();
  };

  createPost = async (postData) => {
    return await Posts.create(postData);
  };

  findPostById = async (postId) => {
    return await Posts.findOne({
      where: {
        id: postId
      }
    });
  };

  findImagesByPostId = async (postId) => {
    return await Images.findAll({
      where: {
        postId: postId
      }
    });
  };

  createImages = async (images, postId, userId, req) => {
    try {
      const imagePromises = images.map((image) => {
        return Images.create({
          url: req.protocol + '://' + req.get('host') + '/' + image.path, // 파일 경로를 URL로 변환
          postId: postId,
          userId: userId
        });
      });

      await Promise.all(imagePromises);
      return { status: 200, response: { message: 'Images created successfully' } };
    } catch (err) {
      console.error(err);
      return { status: 500, response: { error: 'Error creating images' } };
    }
  };

  toggleLike = async (postId, userId) => {
    try {
      const like = await Likes.findOne({ where: { userId, postId } });

      if (like) {
        await like.destroy();
        return { status: 200, response: { message: 'Like removed.' } };
      } else {
        await Likes.create({ userId, postId });
        return { status: 200, response: { message: 'Like added.' } };
      }
    } catch (err) {
      console.error(err);
      return { status: 500, response: { error: 'Error toggling like' } };
    }
  };

  toggleReport = async (postId, userId) => {
    try {
      const report = await Reports.findOne({ where: { userId, postId } });

      if (report) {
        await report.destroy();
        return { status: 200, response: { message: 'Report removed.' } };
      } else {
        await Reports.create({ userId, postId });
        return { status: 200, response: { message: 'Report added.' } };
      }
    } catch (err) {
      console.error(err);
      return { status: 500, response: { error: 'Error toggling report' } };
    }
  };
}

module.exports = TestRepository;
