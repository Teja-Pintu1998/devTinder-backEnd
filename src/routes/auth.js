const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");



//signup user API
authRouter.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body
        //validating the user's data below
        validateSignupData(req)


        //encrypting the password

        const hash_Password = await bcrypt.hash((req?.body?.password), 10)
        req.body.password = hash_Password;

        //the below line means you are creating a new instance (document) of the User model using the data provided in req.body.
        const user = new User(req.body);

        // const user = new User({
        //     firstName, lastName, emailId, password: hash_Password
        // });

        await user.save()
        res.send("User added successfully!")

    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

//login user API
authRouter.post("/login", async (req, res) => {

    try {
        const { emailId, password } = req.body;
        //finding for user exixtence
        const user = await User.findOne({ emailId })
        if (!user) {
            return res.status(400).send("Invalid credentials")
        }
        const isPasswordValid = await user.validatePassword(password)
        if (!isPasswordValid) {
            return res.status(400).send("Invalid credentials")
        }
        //Here, we create the jwt token

        const token = await user.getJWT() //here, we can see getJWT is being called inside user object and the token which is the returned value of this getJWT function is stored in token variable.
        //console.log(token);

        //we put this jwt inside cookie and send back to user along with the response

        res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) })


        res.send("login successfull for- !" + user.firstName)
    } catch (err) {
        return res.status(500).send("Error: " + err.message);

    }


})

//logout API - just set the token to null and expire the cookie right there. Expired cookies are effectively no longer exists in our browsers.

authRouter.post("/logout", async (req,res) => {
    res
        .cookie("token", null, {
            expires: new Date(Date.now())
        })
        .send("You have successfully logout");
})























module.exports = authRouter;
