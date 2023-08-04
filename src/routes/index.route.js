const express = require("express")
const router = express.Router()
const postRouter = require('../posts/post.route')

router.use('/post', postRouter)


module.exports = router