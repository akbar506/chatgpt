const userModel = require("../models/user.model")
const chatModel = require("../models/chat.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function createChat(req, res) {
    const { title } = req.body;

    try {
        // Get the user object which we save in auth.middleware.js
        const user = req.user;
        const chat = new chatModel({
            user: user._id,
            title
        })

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

module.exports = {
    createChat,
}