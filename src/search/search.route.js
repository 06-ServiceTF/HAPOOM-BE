const express = require('express');
const router = express.Router();
const SearchController = require('./search.controller');
const searchController = new SearchController();

router.get('/', (req, res, next) => searchController.search(req, res, next));

module.exports = router;

// GET /search?q=example&category=users