const express = require("express")
const authControllers = require("../controllers/auth.controller")
const router = express.Router()

/* /api/auth/register */
router.post("/register", authControllers.registerUser)

/* /api/auth/login */
router.post("/login", authControllers.loginUser)

module.exports = router