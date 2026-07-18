const express = require("express")
const authControllers = require("../controllers/auth.controller")
const router = express.Router()

/* /api/auth/register */
router.post("/register", authControllers.registerUser)

/* /api/auth/login */
router.post("/login", authControllers.loginUser)

/* /api/auth/logout */
router.post("/logout", authControllers.logoutUser)

/* /api/auth/refresh */
router.post("/refresh", authControllers.getAccessToken)

module.exports = router