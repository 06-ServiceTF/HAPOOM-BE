const { User, Post, Image, Like } = require("../models");
const { Op, Sequelize } = require("sequelize");
const LikeRepository = require("../likes/like.repository");

class SearchRepository {
  // 유저 검색
  async searchUsersbyQuery(query) {
    return await User.findAll({
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
          [query, query + "%", "%" + query + "%"], // SQL injection 방지 // 검색어 완전일치 > 검색어로 시작 > 검색어 포함
          "ASC",
        ],
      ],
    });
  }

   // 게시글 검색
   async searchPostsbyQuery(query, email, method) {
    const posts = await Post.findAll({
      where: {
        [Op.or]: [{ content: { [Op.like]: `%${query}%` } }],
      },
      include: [
        {
          model: Image,
          attributes: ["path"],
        },
        {
          model: Like,
          attributes: [],
          where: {
            userId: User,
          },
          required: false,
        },
      ],
      attributes: [
        "postId",
        "content",
        [
          Sequelize.literal("case when likes.userId is null then false else true end"),
          "likeState"
        ],
      ],
      group: ["Post.postId", "Images.path", "Likes.userId"],
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
    
    const likeRepository = new LikeRepository();
    const postsWithLikeState = await Promise.all(
      posts.map(async (post) => {
        const likeState = await likeRepository.existLike(post.postId, email, method);
        return {
          ...post.get(),
          likeState: likeState ? true : false,
        };
      })
    );
    
    return postsWithLikeState;
  }
}

module.exports = SearchRepository;