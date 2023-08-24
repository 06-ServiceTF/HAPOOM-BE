class SearchService {

    constructor(userRepository, postRepository){
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    async search(query, category, email, method) {
        switch (category) {
            case "users":
                return await this.searchUsers(query);
            case "posts":
                return await this.searchPosts(query, email, method);
            case "tags":  
                return await this.searchPostsByTag(query, email, method);
            default: 
                throw new Error("검색 카테고리가 없습니다.");
        }
    }

    async searchUsers(query) {
        const users = await this.userRepository.searchUsers(query);
        if (users.length === 0) {
            throw new Error("유저 검색 결과가 없습니다.");
        }
        return users;
    }

    async searchPosts(query, email, method) {
        const posts = await this.postRepository.searchPosts(query, email, method);
        if (posts.length === 0) {
            throw new Error("게시글 검색 결과가 없습니다.");
        }
        return posts;  
    }

    async searchPostsByTag(query, email, method) {
        const tags = await this.postRepository.searchPostsByTag(query, email, method);
        if (tags.length === 0) {
            throw new Error("게시글 검색 결과가 없습니다.");
        }
        return tags;
    }
}

module.exports = SearchService;
