const SearchRepository = require("./search.repository");
const searchRepository = new SearchRepository();

class SearchService {
    constructor(){
    }
    async search(query, category, email, method) {
        //console.log(query,category,email,method)
        switch (category) {
            case "users":
                console.log("유저검색")
                return await this.searchUsers(query);
            case "posts":
                console.log("게시물검색")
                return await this.searchPosts(query, email, method);
            case "tags":
                console.log("태그검색")
                return await this.searchPostsByTag(query, email, method);
            default: 
                throw new Error("검색 카테고리가 없습니다.");
        }
    }

    async searchUsers(query) {
        const users = await searchRepository.searchUsers(query);
        if (users.length === 0) {
            throw new Error("유저 검색 결과가 없습니다.");
        }
        return users;
    }

    async searchPosts(query, email, method) {
        const posts = await searchRepository.searchPosts(query, email, method);
        if (posts.length === 0) {
            throw new Error("게시글 검색 결과가 없습니다.");
        }
        return posts;  
    }

    async searchPostsByTag(query, email, method) {
        const tags = await searchRepository.searchPostsByTag(query, email, method);
        if (tags.length === 0) {
            throw new Error("게시글 검색 결과가 없습니다.");
        }
        return tags;
    }
}

module.exports = SearchService;
