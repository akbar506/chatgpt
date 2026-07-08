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
                const [userMessage, MessageVectors] = await Promise.all([
                    // Save the user's message to the database
                    new messageModel({
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        content: messagePayload.content,
                        role: "user"
                    }),

                    // Generate embeddings for the user's message
                    vectorService.generateEmbedding(messagePayload.content),
                ])
                await userMessage.save();

                // Find the chat and update its lastActivity timestamp
                const chat = await chatModel.findById(messagePayload.chat);
                if (!chat) {
                    socket.emit("ai-response-error", { error: "Chat not found" });
                    return;
                }

                if (chat) {
                    chat.lastActivity = new Date();
                    await chat.save();
                }

                const [history, vectorMemory] = await Promise.all([
                    // Find all messages with the same chat ID to get the conversation history
                    messageModel.find({
                        chat: messagePayload.chat
                    }).sort({ createdAt: -1 }).limit(20).lean().then(messages => messages.reverse()),
                    // Query the vector database (Pinecone) for similar messages
                    vectorService.queryVectorMemory({
                        vector: MessageVectors[0].values,
                        topK: 3,
                        metadata: {
                            userId: { "$eq": socket.user._id.toString() },
                        }
                    }),
                ])

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

                // Short term memory (STM) from the current chat messages
                const stm = history.map((chat) => {
                    return {
                        role: chat.role,
                        parts: [{ text: chat.content }]
                    }
                });

                // Long term memory (LTM) from the vector database (Pinecone)
                const ltm = vectorMemory.map((chat) => {
                    return {
                        role: chat.metadata.role,
                        parts: [{ text: chat.metadata.content }]
                    }
                });

                const previousMessagesInstruction = {
                    role: "user",
                    parts: [{ text: "These are the previous messages in the conversation. Use them to provide context for your response if user has ask query which relates to them. These messages are your second priority." }]
                }

                const currentChatMessagesInstruction = {
                    role: "user",
                    parts: [{ text: "These are the messages in the current chat. Use them to provide context for your response if needed. These messages are your first priority." }]
                }

                // Combine all the chats and instructions
                const combineMemory = [previousMessagesInstruction, ...ltm, currentChatMessagesInstruction, ...stm];

                const startTime = Date.now();

                let aiResponse;
                // Generate AI response based on the conversation history
                if (messagePayload.stream) {
                    const stream = await aiService.generateAIResponseStream(combineMemory, messagePayload.thinkingLevel);
                    let answer = "";

                    // Stream the AI response in chunks and emit each chunk to the client
                    for await (const chunk of stream) {

                        if (!chunk.text) continue;

                        answer += chunk.text;

                        const words = chunk.text.split(/(\s+)/);

                        for (const word of words) {
                            socket.emit("ai-chunk", {
                                chat: messagePayload.chat,
                                content: word,
                            });
                        }

                        // Count tokens after streaming completes
                        const [promptTokens, completionTokens] = await Promise.all([
                            aiService.countTokens(combineMemory),
                            aiService.countTokens(answer),
                        ]);

                        aiResponse = {
                            content: answer,
                            promptTokens: promptTokens,
                            completionTokens: completionTokens,
                            totalTokens: promptTokens + completionTokens,
                        };
                    }
                } else {
                    aiResponse = await aiService.generateAIResponse(combineMemory, messagePayload.thinkingLevel);
                }

                const endTime = Date.now();
                const processingTime = (endTime - startTime) / 1000; // Convert to seconds

                socket.emit("ai-response", {
                    content: aiResponse.content,
                    chat: messagePayload.chat,
                    promptTokens: aiResponse.promptTokens,
                    completionTokens: aiResponse.completionTokens,
                    totalTokens: aiResponse.totalTokens,
                    totalResponseTime: processingTime,
                });

                const [aiMessage, aiMessageVectors] = await Promise.all([
                    // Save the AI's response to the database
                    new messageModel({
                        chat: messagePayload.chat,
                        user: socket.user._id, // AI messages don't have a user
                        content: aiResponse.content,
                        role: "model",
                        promptTokens: aiResponse.promptTokens,
                        completionTokens: aiResponse.completionTokens,
                        totalTokens: aiResponse.totalTokens
                    }),

                    // Generate embeddings for the AI's response
                    vectorService.generateEmbedding(aiResponse.content),

                    // update the user message promptTokens
                    userMessage.promptTokens = aiResponse.promptTokens,
                    userMessage.completionTokens = aiResponse.completionTokens,
                    userMessage.totalTokens = aiResponse.totalTokens,
                    userMessage.save(),
                ])

                await aiMessage.save();

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
                });
            } catch (error) {
                console.error("Error processing AI message:", error);
                socket.emit("ai-response-error", { error: "Error occured while generating. Please try again" });
            }
        })
    });
}

module.exports = initSocketServer;