const mongoose = require("mongoose");
const validator = require("validator")
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
        validate(value){
            if(!validator.isEmail(value)){
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
}, { timestamps: true })

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;