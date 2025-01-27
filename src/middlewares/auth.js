const jwt = require("jsonwebtoken")
const User = require("../models/user");



const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            throw new Error("Authorization token missing")
        }
        const decodedMessage = await jwt.verify(token, "DEV@TINDER");
        const { _id } = decodedMessage;
        const user = await User.findById( _id );
        if (!user) {
            throw new Error("User doesn't exists")

        }
        //console.log(req.user)

        req.user = user;
        //console.log(req.user)
        next();

    } catch (err) {
        res.status(400).send("Error: " + err.message);

    }



}

module.exports = {userAuth};