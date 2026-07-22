const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const isUserExist = await userModel.findOne({ email })

        if (isUserExist) {
            return res.status(400).json({ 
                success: false,
                message: "User with this email already exists. Try logging in." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new userModel({
            fullName: {
                firstName,
                lastName
            },
            email,
            password: hashedPassword
        })

        const refreshToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

        await newUser.save()
        
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: "Lax", path: "/", secure: true }) // 7 days

        res.status(201).json({ 
            success: true,
            message: "User registered successfully",
            accessToken, 
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            }
        })
    } catch (error) {
        console.error("Error registering user:", error)
        res.status(500).json({ 
            success: false,
            message: "Internal Server error" 
        })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const refreshToken = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        const accessToken = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

        // Set the refresh token in an HTTP-only cookie and enable SameSite=Lax and Secure attributes for cross-site requests
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: "Lax", path: "/", secure: true }) // 7 days

        res.status(200).json({
            message: "User logged in successfully",
            success: true,
            accessToken,
            user: {
                id: existingUser._id,
                fullName: existingUser.fullName,
                email: existingUser.email
            }
        });
        
    } catch (error) {
        console.error("Error logging in user:", error)
        res.status(500).json({ 
            success: false,
            message: "Internal Server error" 
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        // Clear the refresh token cookie
        res.clearCookie("refreshToken");

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({ message: "Internal Server error" });
    }
};

const getAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }

        // Verify the refresh token and generate a new access token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

        res.status(200).json({
            message: "Access token generated successfully",
            success: true,
            accessToken,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error getting access token:", error);
        res.status(500).json({ message: "Internal Server error", success: false });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getAccessToken
}