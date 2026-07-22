const mongoose = require("mongoose");
const messageModel = require("../models/message.model");
const chatModel = require("../models/chat.model")

async function getMessages(req, res) {
    try {
        const { chatId } = req.params;

        // Validate chatId
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid chat ID. Please enter valid chat."
            });
        }

        // Fetch messages for the given chatId
        const messages = await messageModel.find({
            chat: chatId
        }).sort({ createdAt: 1 }); // Sort messages by creation time in ascending order

        if (!messages) {
            return res.status(404).json({
                success: false,
                message: "No messages found for this chat"
            });
        }

        const isChatExist = await chatModel.findById(chatId);
        if (!isChatExist) {
            return res.status(404).json({
                success: false,
                message: "Chat not found. Chat has been deleted or link is invalid."
            });
        }

        // Check if the user making the request is a participant in the chat. If not, return a 403 Forbidden response.
        if (req.user._id.toString() != isChatExist.user.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view messages for this chat"
            });
        }

        res.status(200).json({
            total: messages.length,
            success: true,
            messages
        });
    } catch (err) {
        console.error("Error fetching messages", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    getMessages,
}