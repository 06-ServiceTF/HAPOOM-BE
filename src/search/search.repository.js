const { Users, Posts, Images, Likes, Mappings, Tags } = require("../models");
const { Op, Sequelize } = require("sequelize");

const likeRepository = new (require("../likes/like.repository"))();

class SearchRepository {
  constructor() {
  }

  // 유저 아이디 (로그인) 가져오기
  async getUserIdByEmailAndMethod(email,method) {
    try {
      const user = await Users.findOne({
        where: { email,method },
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
          WHEN nickname LIKE :query1 THEN 1 
          WHEN nickname LIKE :query2 THEN 2 
          WHEN nickname LIKE :query3 THEN 3 
          ELSE 4 
        END`),
            "ASC",
          ],
        ],
        replacements: { query1: `%${query}%`, query2: `%${query}%`, query3: `%${query}%` },
      });
    } catch (err) {
      console.error("유저 검색 에러:", err);
      throw err;
    }
  }

  async searchPosts(query, email, method) {
    const likeQuery = `%${query}%`;
    const currentUserId = await this.getUserIdByEmailAndMethod(email, method);

    try {
      const posts = await Posts.findAll({
        where: { content: { [Op.like]: likeQuery } }, // 쿼리 부분 일치
        include: [
          // 포스트 이미지 패스 포함
          { model: Images, attributes: ["url"] },
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
              "case when Likes.userId is null then false else true end"
            ),
            "likeState",
          ],
        ],
        group: ["postId", "Images.url", "Likes.userId"], //?
        order: [
          [
            Sequelize.literal(`CASE 
            WHEN content LIKE '${likeQuery}' THEN 1 
            WHEN content LIKE '${likeQuery}' THEN 2 
            WHEN content LIKE '${likeQuery}' THEN 3 
            ELSE 4 
          END`),
            "ASC",
          ],
        ],
      });

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

  // 태그 검색
  async searchPostsByTag(query, email, method) {
    const currentUserId = await this.getUserIdByEmailAndMethod(email,method);

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
          { model: Images, attributes: ["url"] },
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
              "case when Likes.userId is null then false else true end"
            ),
            "likeState",
          ],
        ],
        group: ["postId", "Images.url", "Likes.userId"],
      });

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
