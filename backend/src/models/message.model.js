const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "model", "system"],
        required: true
    },
    thoughts: {
        type: String,
        default: ""
    },
    promptTokens: {
        type: Number,
        default: 0
    },
    completionTokens: {
        type: Number,
        default: 0
    },
    totalTokens: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;