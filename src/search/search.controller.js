const SearchService = require("../search/search.service");
const UserRepository = require("../profiles/profile.repository");
const PostRepository = require("../posts/post.repository");

class SearchController {
    async search(req, res, next) {
        const query = req.query.q;
        const category = req.query.category;
        
        const userRepository = new UserRepository();
        const postRepository = new PostRepository();
        const searchService = new SearchService(userRepository, postRepository);

        try {
            const result = await searchService.search(query, category);
            res.status(200).json(result);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

module.exports = SearchController;  // Export the class, not an instance.
