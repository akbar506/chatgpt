const userModel = require("../models/user.model")
const chatModel = require("../models/chat.model")
const messageModel = require("../models/message.model")
const { Pinecone } = require('@pinecone-database/pinecone')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const chatgptIndex = pc.Index(process.env.PINECONE_INDEX_NAME);

async function createChat(req, res) {
    const { title } = req.body;

    try {
        // Get the user object which we save in auth.middleware.js
        const user = req.user;

        const chat = new chatModel({
            user: user._id,
            title
        })
        await chat.save();
        res.status(200).json({
            success: true,
            message: "Chat successfully created",
            chat: {
                _id: chat._id,
                title: chat.title,
                lastActivity: chat.lastActivity,
                user: chat.user
            }
        })
    } catch (err) {
        console.error("Error creating chat", err);
        res.status(500).json({
            success: false,
            message: "Internet Server Error"
        })
    }
}

async function deleteChat(req, res) {
    try {
        const { chatId } = req.params;
        const user = req.user;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "Chat ID is required"
            })
        }

        const chat = await chatModel.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            })
        }

        // Check if the user is the owner of the chat
        if (chat.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this chat"
            })
        }

        // Delete the chat and its associated messages from the database and Pinecone index
        await chatgptIndex.deleteMany({
            filter: {
                chatId: { "$eq": chatId },
            }
        })
        await messageModel.deleteMany({ chat: chatId });
        await chatModel.findByIdAndDelete(chatId);

        res.status(200).json({
            success: true,
            message: "Chat deleted successfully"
        })
    } catch (error) {
        console.error("Error deleting chat", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    createChat,
    deleteChat,
}