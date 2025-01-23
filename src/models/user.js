const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    }, lastName: {
        type: String
    }, emailId: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid")
            }
        }
    }, password: {
        type: String,
        required: true
    }, age: {
        type: Number
    }, gender: {
        type: String
    }, photoUrl: {
        type: String
    }, about: {
        type: String,
        //In JavaScript, this depends on how and where the function is invoked, not necessarily where it's defined. And in the case of Mongoose, it’s a special case because:Mongoose explicitly invokes the default function at the document level.It assigns the this context to the document being created, overriding the typical behavior.
        default: function () { return `Thank you for the sign-up - ${this.firstName}` }
    },
    skills: {
        type: [String]
    }
}, { timestamps: true });

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign(
        { _id: user._id },
        "DEV@TINDER",
        { expiresIn: "7d" }
    );
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        user.password
    );
    return isPasswordValid;
}


const userModel = mongoose.model("User", userSchema);
module.exports = userModel;