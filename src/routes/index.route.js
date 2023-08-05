const express = require("express")
const router = express.Router()
const postRouter = require('../posts/post.route.js')

router.use('/post', postRouter)


module.exports = router