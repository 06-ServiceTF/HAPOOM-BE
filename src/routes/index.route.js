const express = require("express")

const authRouter = require("./auth/auth.route")

const router = express.Router()

app.use("/auth", authRouter);

module.exports = router