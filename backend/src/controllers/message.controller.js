const mongoose = require("mongoose");
const messageModel = require("../models/message.model");

async function getMessages(req, res) {
    try {
        const { chatId } = req.params;

        // Validate chatId
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid chat ID"
            });
        }

        // Fetch messages for the given chatId
        const messages = await messageModel.find({
            chat: chatId
        }).sort({ createdAt: 1 }); // Sort messages by creation time in ascending order

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