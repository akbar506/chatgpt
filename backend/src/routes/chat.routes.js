const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const chatController = require("../controllers/chat.controller")

/* /api/chat */
router.post("/", authMiddleware.authUser, chatController.createChat)
router.get("/", authMiddleware.authUser, chatController.getChats)

/* /api/chat/:chatId */
router.delete("/:chatId", authMiddleware.authUser, chatController.deleteChat)

/* /api/chat/share/:chatId */
router.post("/share/:chatId", authMiddleware.authUser, chatController.shareChat)

/* /api/chat/share/:shareToken */
router.get("/share/:shareToken", chatController.getSharedChat)

module.exports = router;