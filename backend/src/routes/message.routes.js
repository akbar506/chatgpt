const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const messageController = require('../controllers/message.controller');

router.get('/:chatId', authMiddleware.authUser, messageController.getMessages);

module.exports = router;