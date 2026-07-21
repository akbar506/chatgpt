const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")

const authUser = async (req, res, next) => {
    // Check if the Authorization header is present and starts with "Bearer "
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Extract the access token from the Authorization header
    const accessToken = authHeader.slice(7).trim(); // Remove "Bearer " prefix and trim any whitespace
    if (!accessToken || accessToken === "undefined" || accessToken === "null") {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!accessToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    try {
        // Get the decoded object in jwt token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Add user object in request object
        req.user = user

        next()
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
}

module.exports = {
    authUser,
}