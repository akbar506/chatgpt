const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    shared: {
        type: Boolean,
        default: false
    },
    sharedLink: {
        type: String,
        default: null
    },
    lastActivity: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
})

const chatModel = mongoose.model("chat", chatSchema);

module.exports = chatModel