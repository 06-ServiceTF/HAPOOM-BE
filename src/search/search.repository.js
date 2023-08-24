const { Users, Posts, Images, Likes, Mappings, Tags } = require("../models");
const { Op, Sequelize } = require("sequelize");

class SearchRepository {
  constructor(likeRepository) {
    this.likeRepository =
      likeRepository || new (require("../likes/like.repository"))();
  }

  // 유저 아이디 (로그인) 가져오기
  async getUserIdByEmailAndMethod(email, method) {
    try {
      const user = await Users.findOne({
        where: { email, method },
      });
      return user ? user.userId : null;
    } catch (err) {
      console.error("유저 아이디 가져오기 에러:", err);
      throw err;
    }
  }

  // 닉네임 또는 이메일로 검색하기 (유저검색)
  async searchUsers(query) {
    try {
      return await Users.findAll({
        where: {
          [Op.or]: [
            { nickname: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
          ],
        },
        order: [
          [
            Sequelize.literal(`CASE 
            WHEN nickname LIKE ? THEN 1 
            WHEN nickname LIKE ? THEN 2 
            WHEN nickname LIKE ? THEN 3 
            ELSE 4 
          END`),
            [query, query + "%", "%" + query + "%"],
            "ASC",
          ],
        ],
      });
    } catch (err) {
      console.error("유저 검색 에러:", err);
      throw err;
    }
  }

  // 포스트(게시물) 검색
  async searchPosts(query, email, method) {
    const currentUserId = await this.getUserIdByEmailAndMethod();

    try {
      const posts = await Posts.findAll({
        where: { content: { [Op.like]: `%${query}%` } }, // 쿼리 부분 일치
        include: [
          // 포스트 이미지 패스 포함
          { model: Images, attributes: ["path"] },
          {
            // Include like information of the posts by current user
            model: Likes,
            attributes: [],
            where: { userId: currentUserId },
            required: false, // ?
          },
        ],
        attributes: [
          "postId",
          "content",
          [
            Sequelize.literal(
              "case when likes.userId is null then false else true end"
            ),
            "likeState",
          ],
        ],
        group: ["postId", "Images.path", "Likes.userId"], //?
        order: [
          [
            Sequelize.literal(`CASE 
            WHEN content LIKE ? THEN 1 
            WHEN content LIKE ? THEN 2 
            WHEN content LIKE ? THEN 3 
            ELSE 4 
          END`),
            [query, query + "%", "%" + query + "%"],
            "ASC",
          ],
        ],
      });

      const likeRepository = new LikeRepository(); // 좋아요 레포지토리 끌어오기
      // currentUserId를 베이스로 existlike 함수 map으로 찾기
      return await Promise.all(
        posts.map(async (post) => {
          const likeState = await likeRepository.existLike(
            post.postId,
            email,
            method
          );
          return { ...post.get(), likeState: !!likeState };
        })
      );
    } catch (err) {
      console.log("포스트 검색 에러:", err);
      throw err;
    }
  }

  //

  // 태그 검색
  async searchPostsByTag(query, email, method) {
    const currentUserId = await this.getUserIdByEmailAndMethod();

    try {
      const tags = await Tags.findAll({
        where: { tag: { [Op.like]: `%${query}%` } },
      });

      // 태그 찾아서 태그 아이디 뽑기
      const tagIds = tags.map((tag) => tag.tagId);
      // 태그 아이디로 매핑 찾기
      const mappings = await Mappings.findAll({
        where: { tagId: { [Op.in]: tagIds } },
      });
      // 매핑에서 포스트 아이디 뽑기
      const postIds = mappings.map((mapping) => mapping.postId);

      // > 갖고옴

      const posts = await Posts.findAll({
        where: { postId: { [Op.in]: postIds } },
        include: [
          // Include image paths of the posts
          { model: Images, attributes: ["path"] },
          {
            model: Likes,
            attributes: [],
            where: { userId: currentUserId },
            required: false,
          },
        ],
        attributes: [
          "postId",
          "content",
          [
            Sequelize.literal(
              "case when likes.userId is null then false else true end"
            ),
            "likeState",
          ],
        ],
        group: ["postId", "Images.path", "Likes.userId"],
      });

      const likeRepository = new LikeRepository();
      return await Promise.all(
        posts.map(async (post) => {
          const likeState = await likeRepository.existLike(
            post.postId,
            email,
            method
          );
          return { ...post.get(), likeState: !!likeState };
        })
      ); // ??
    } catch (err) {
      console.error("태그 검색 에러:", err);
      throw err;
    }
  }
}

module.exports = SearchRepository;
