const cookieParser = require("cookie-parser")
const express = require("express")
const app = express()
const cors = require('cors')

/* Routes */
const authRoutes = require("./routes/auth.routes")
const chatRoutes = require("./routes/chat.routes")
const messageRoutes = require("./routes/message.routes")

/* Middlewares */
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

/* Using Routes */
app.use("/api/auth", authRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)

module.exports = app;