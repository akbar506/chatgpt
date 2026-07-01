require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/db/db")
const initSocketServer = require("./src/sockets/socket.server")
const httpServer = require("http").createServer(app)

connectDB()
initSocketServer(httpServer)

const port = process.env.PORT || 8000

httpServer.listen(port, ()=>{
    console.log("Server Running at", port)
})