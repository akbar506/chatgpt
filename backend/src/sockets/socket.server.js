const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const aiService = require("../services/ai.service");
const chatModel = require("../models/chat.model");
const vectorService = require("../services/vector.service")

async function initSocketServer(httpServer) {
    const io = new Server(httpServer, {});

    io.use(async (socket, next) => {
        // Get the token from the cookie in the socket handshake headers
        const cookies = cookie.parseCookie(socket.handshake.headers?.cookie || "");

        if (!cookies.token) {
            return next(new Error("Authentication error: No token provided"));
        }

        try {
            // Verify the token and get the user ID
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.userId);

            // Attach the user object to the socket for future use
            socket.user = user;
            next();
        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }
    })

    io.on("connection", (socket) => {
        socket.on("ai-message", async (messagePayload) => {
            try {
                // Save the user's message to the database
                const userMessage = new messageModel({
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    content: messagePayload.content,
                    role: "user"
                });
                await userMessage.save();

                // Generate embeddings for the user's message
                const MessageVectors = await vectorService.generateEmbedding(messagePayload.content)
                
                // Query the vector database (Pinecone) for similar messages
                const vectorMemory = await vectorService.queryVectorMemory({
                    vector: MessageVectors[0].values,
                    topK: 3,
                    metadata: {
                        userId: { "$eq": socket.user._id.toString() },
                    }
                })
                
                // Save the generated embeddings to the vector database (Pinecone)
                await vectorService.createVectorMemory({
                    vector: MessageVectors[0].values,
                    metadata: {
                        userId: socket.user._id.toString(),
                        chatId: messagePayload.chat,
                        role: "user",
                        content: messagePayload.content
                    },
                    messageId: userMessage._id.toString()
                })

                // Find the chat and update its lastActivity timestamp
                const chat = await chatModel.findById(messagePayload.chat);
                if (chat) {
                    chat.lastActivity = new Date();
                    await chat.save();
                }

                // Find all messages with the same chat ID to get the conversation history
                const history = (await messageModel.find({ chat: messagePayload.chat }).sort({ createdAt: -1 }).limit(20)).reverse();

                // Generate AI response based on the conversation history
                const aiResponse = await aiService.generateAIResponse(history.map((chat) => {
                    return {
                        role: chat.role,
                        parts: [{ text: chat.content }]
                    }
                }), messagePayload.thinkingLevel);

                // Save the AI's response to the database
                const aiMessage = new messageModel({
                    chat: messagePayload.chat,
                    user: socket.user._id, // AI messages don't have a user
                    content: aiResponse.content,
                    role: "model",
                    promptTokens: aiResponse.promptTokens,
                    completionTokens: aiResponse.completionTokens,
                    totalTokens: aiResponse.totalTokens
                })

                await aiMessage.save();

                // Generate embeddings for the AI's response
                const aiMessageVectors = await vectorService.generateEmbedding(aiResponse.content)

                // Save the generated embeddings for the AI's response to the vector database (Pinecone)
                await vectorService.createVectorMemory({
                    vector: aiMessageVectors[0].values,
                    metadata: {
                        userId: socket.user._id.toString(),
                        chatId: messagePayload.chat,
                        role: "model",
                        content: aiResponse.content
                    },
                    messageId: aiMessage._id.toString()
                })

                // update the user message promptTokens
                userMessage.promptTokens = aiResponse.promptTokens;
                userMessage.completionTokens = aiResponse.completionTokens;
                userMessage.totalTokens = aiResponse.totalTokens;
                await userMessage.save();

                socket.emit("ai-response", {
                    content: aiResponse.content,
                    chat: messagePayload.chat,
                    promptTokens: aiResponse.promptTokens,
                    completionTokens: aiResponse.completionTokens,
                    totalTokens: aiResponse.totalTokens
                });
            } catch (error) {
                console.error("Error processing AI message:", error);
                socket.emit("ai-response-error", { error: "Error occured while generating. Please try again" });
            }
        })
    });
}

module.exports = initSocketServer;