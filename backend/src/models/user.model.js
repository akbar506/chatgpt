const monngoose = require("mongoose")

const userSchema = new monngoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            maxlength: 20
        },
        lastName: {
            type: String,
            required: true,
            maxlength: 20
        }
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6
    }
}, {
    timestamps: true
})

const userModel = monngoose.model("User", userSchema)

module.exports = userModel