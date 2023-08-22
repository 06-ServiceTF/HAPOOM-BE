class SearchService {

    constructor(userRepository, postRepository){
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    async search(query, category) {
        switch (category) {
            case "users":
                return await this.searchUsers(query);  // Changed to searchUsers

            case "posts":
                return await this.searchPosts(query);

            default: 
                throw new Error("검색 카테고리가 없습니다.");
        }
    }

    async searchUsers(query) {
        const users = await this.userRepository.searchUsersbyQuery(query);
        if (users.length === 0) {
            throw new Error("유저 검색 결과가 없습니다.");
        }
        return users;
    }

    async searchPosts(query) {
        const posts = await this.postRepository.searchPostsbyQuery(query);
        if (posts.length === 0) {
            throw new Error("게시글 검색 결과가 없습니다.");
        }
        return posts;  // Add return statement.
    }
}

module.exports = SearchService;  // Export the class, not an instance.