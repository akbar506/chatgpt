const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const isUserExist = await userModel.findOne({ email })

        if (isUserExist) {
            return res.status(400).json({ message: "User already exists" })
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

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET)

        await newUser.save()

        res.cookie("token", token)

        res.status(201).json({ 
            success: true,
            message: "User registered successfully", 
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

        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET);

        res.cookie("token", token)

        res.status(200).json({
            message: "User logged in successfully",
            success: true,
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

module.exports = {
    registerUser,
    loginUser
}