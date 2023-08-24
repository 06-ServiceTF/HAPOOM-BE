const SearchService = require("../search/search.service");
const UserRepository = require("../profiles/profile.repository");
const PostRepository = require("../posts/post.repository");

class SearchController {
    constructor(userRepository, postRepository, searchService) {
        this.userRepository = userRepository || new UserRepository();
        this.postRepository = postRepository || new PostRepository();
        this.searchService = searchService || new SearchService(this.userRepository, this.postRepository);
    }

    async search(req, res, next) {
        const query = req.query.q;
        const category = req.query.category;
        const email = req.body.email;  // 예시: email과 method가 body에 있다고 가정
        // const method = req.body.method; // 패스포트용으로 넣어놨음. if 사용자 로그인 정보가 데이터 안에 들어있으면 method 대신 passport (google 같은 것)을 불러올 수 있음
    
        try {
            const result = await this.searchService.search(query, category, email);
            res.status(200).json(result);
        } catch (err) {
            res.status(err.statusCode || 400).json({ message: err.message });
        }
    }
}

module.exports = SearchController;  // Export the class, not an instance.
