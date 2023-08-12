const PostService = require('./post.service');
const CustomError = require('../middlewares/error.middleware');

class PostController {
  postService = new PostService();

  //* 게시글 생성(완료)
  createPostImage = async (req, res, next) => {
    console.log(1)
    try {
      const createPostImage = await this.postService.createPostImage(req);

      // 이미지가 1장이라도 없을시 error
      if (!req.files) {
        throw new CustomError('이미지가 필요합니다.', 403);
      }

      res.status(201).json({ post: createPostImage });
    } catch (err) {
      next(err);
    }
  };

  //* 게시글 상세보기(완료)
  readPost = async (req, res, next) => {
    try {
      const readPost = await this.postService.readPost(req);

      res.status(200).json({ post: readPost });
    } catch (err) {
      next(err);
    }
  };

  //* 게시글 수정하기
  updatePostImage = async (req, res, next) => {
    const { email } = req.user;

    try {
      // 로그인이 안되어 있을 때
      if (!email) {
        throw new CustomError('로그인 후 사용가능합니다.', 403);
      }

      // 로그인 권한 여부 확인
      const confirmUser = await this.postService.confirmUser(req, email);

      if (!confirmUser) {
        throw new CustomError('수정 권한이 없습니다.', 403);
      }

      const updatePostImage = await this.postService.updatePostImage(
        req,
        email
      );

      if (updatePostImage[0] !== 1) {
        throw new CustomError('게시글 수정에 실패했습니다.', 403);
      }

      res.status(201).json({ post: updatePostImage });
    } catch (err) {
      next(err);
    }
  };

  //* 게시글 삭제하기(완료)
  deletePostImage = async (req, res, next) => {
    const { email } = req.user;

    try {
      // 로그인이 안되어 있을 때
      if (!email) {
        throw new CustomError('로그인 후 사용가능합니다.', 403);
      }

      // 로그인 권한 여부 확인
      const confirmUser = await this.postService.confirmUser(req, email);

      if (!confirmUser) {
        throw new CustomError('삭제 권한이 없습니다.', 403);
      }

      // 게시글 삭제
      const deletePostImage = await this.postService.deletePostImage(
        req,
        email
      );

      // 게시글 삭제 성공 유무 확인
      if (deletePostImage !== 1) {
        throw new CustomError('게시글 삭제에 실패했습니다', 403);
      }

      res.status(200).json({ message: '게시글 삭제에 성공했습니다.' });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = PostController;
