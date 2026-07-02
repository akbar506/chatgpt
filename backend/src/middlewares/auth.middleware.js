const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")

const authUser = async (req, res, next) => {
    const { token } = req.cookies;

    if(!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    try {
        // Get the decoded object in jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        const user = await userModel.findById(decoded.userId)
        // Add user object in request object
        req.user = user

        next()
    } catch (err) {
        console.error("Error: ", err)
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
}

module.exports = {
    authUser,
}