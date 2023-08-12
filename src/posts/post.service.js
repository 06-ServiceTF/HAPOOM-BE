const PostRepository = require('./post.repository');
const CustomError = require('../middlewares/error.middleware');
const { sequelize } = require('../models');
const { deleteImage } = require('../middlewares/multer.middleware');
class PostService {
  postRepository = new PostRepository();

  //* 게시글 생성
  createPostImage = async (req) => {
    const { email } = req.user;
    let { content, musicTitle, musicUrl, tag, latitude, longitude, placeName } = req.body;
    const images = req.files;
    const transaction = await sequelize.transaction();

    try {
      // image.path 추출
      let imageUrl = [];
      for (let image of images) {
        // imageUrl.push(image.path);
        // multer-s3용
        imageUrl.push(req.protocol + req.get('host') + image.path)
      }

      // 게시물 및 이미지 생성
      const createPostImage = await this.postRepository.createPostImage(
        email,
        content,
        musicTitle,
        musicUrl,
        tag,
        latitude,
        longitude,
        placeName,
        imageUrl,
        transaction
      );

      await transaction.commit();
      return createPostImage;
    } catch (err) {
      await transaction.rollback();
      console.log(err);
    }
  };

  //* 게시글 상세보기
  readPost = async (req) => {
    const { email } = req.user
    const { postId } = req.params;

    const readPost = await this.postRepository.readPost(email, postId);

    return {
      userId: readPost.dataValues.userId,
      postId: readPost.dataValues.postId,
      content: readPost.dataValues.content,
      latitude: readPost.dataValues.latitude,
      longitude: readPost.dataValues.longitude,
      private: readPost.dataValues.private,
      images: readPost.dataValues.Images,
      nickname: readPost.User.nickname,
      userImage: readPost.User.userImage,
      isLiked: readPost.isLiked,
      likeCount: readPost.likeCount,
    };
  };

  //* 게시글 수정하기
  updatePostImage = async (req, email) => {
    const { postId } = req.params;
    let { content, musicTitle, musicUrl, tag, latitude, longitude, placeName } = req.body;
    const images = req.files;
    const transaction = await sequelize.transaction();

    try {
      // 이미지 데이터 가공

      // 1. update용 이미지 url
      // : update 시, 프론트에서 url에 image.path를 담아서 준다.
      let imageUrl = [];
      for (let image of images) {
        imageUrl.push(image.url);
        // multer-s3용
        // imageUrl.push(req.protocol + req.get('host') + image.path)
      }


      // DB에서 기존 이미지 url 찾기
      const findUrl = await this.postRepository.findUrl(
        email,
        postId,
        transaction
      );

      // multer 이미지 삭제
      const multerDelete = await sequelize.transaction(async (t) => {
        return findUrl.map((image) => {
          return deleteImage(image.dataValues.url);
        });
      });

      // 게시글 수정
      const updatePostImage = await this.postRepository.updatePostImage(
        email,
        postId,
        content,
        musicTitle,
        musicUrl,
        tag,
        latitude,
        longitude,
        placeName,
        imageUrl,
        transaction
      );

      await transaction.commit();
      return updatePostImage;
    } catch (err) {
      await transaction.rollback();
      console.log(err);
    }
  };

  //* 게시글 삭제하기
  deletePostImage = async (req, email) => {
    const { postId } = req.params;
    const transaction = await sequelize.transaction();

    try {
      // DB에서 기존 이미지 url 찾기
      const findUrl = await this.postRepository.findUrl(
        email,
        postId,
        transaction
      );

      // multer 이미지 삭제
      const multerDelete = await sequelize.transaction(async (t) => {
        return findUrl.map((image) => {
          return deleteImage(image.dataValues.url);
        });
      }); // 트랜잭션을 빼기, 강제로 에러를 발생 시켜서 테스트 해보기, throw문과 파일명을 일부러 다르게 해보기 음...

      // 게시글 삭제
      const deletePostImage = await this.postRepository.deletePostImage(
        email,
        postId,
        transaction
      );

      await transaction.commit();
      return deletePostImage;
    } catch (err) {
      await transaction.rollback();
      console.log(err);
    }
  };

  //* 로그인 권한 유무 확인
  confirmUser = async (req, email) => {
    const { postId } = req.params;

    const confirmUser = await this.postRepository.confirmUser(email, postId);

    return confirmUser;
  };
}

module.exports = PostService;
