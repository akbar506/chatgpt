const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const chatController = require("../controllers/chat.controller")

/* /api/chat */
router.post("/", authMiddleware.authUser, chatController.createChat)
router.delete("/:chatId", authMiddleware.authUser, chatController.deleteChat)

module.exports = router;