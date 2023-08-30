const SearchService = require("../search/search.service");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const {Users} = require("../models");

const searchService = new SearchService();

class SearchController {
    constructor() {
    }
    async search(req, res, next) {
        const query = req.query.q;
        const category = req.query.category;
        const token = req.cookies.refreshToken;
        let email;
        let method;
        if(!token){
            email="notlogged";
            method="notlogeed";
        }else{
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            email = decoded.email;  // 토큰의 본인 이메일
            method = decoded.method; // 토큰의 본인 메서드
        }
        try {
            const result = await searchService.search(query, category, email,method);
            res.status(200).json(result);
        } catch (err) {
            res.status(err.statusCode || 400).json({ message: err.message });
        }
    }
}

module.exports = SearchController;  // Export the class, not an instance.
