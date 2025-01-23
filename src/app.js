const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const User = require("./models/user");
const { ReturnDocument } = require("mongodb");
const { validateSignupData } = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
app.use(express.json());
app.use(cookieParser());

//signup user API
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {

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

//get profile API
app.get("/profile", userAuth, (req, res) => {
    try {
        const user = req.user;
        res.send(user);

    } catch (err) {
        res.status(500).send("Error: " + err.message);

    }

})

//sending connection request API

app.post("/sendConnectionRequest", userAuth, (req, res) => {
    const user = req.user
    console.log(`${user.firstName} sent the connection request`);
    res.send(`${user.firstName} sent the connection request`)
}
)


















//Get user by email
app.get("/user", async (req, res) => {
    const email = req.body.emailId;
    try {
        const users = await User.find({ emailId: email });
        if (users.length === 0) {
            res.status(400).send("user not found")
        } else {
            res.send(users)

        }


    } catch (err) {
        res.status(400).send("Something went wrong")
    }



})

//Feed API -- get all the users
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users)
    } catch (err) {
        res.status(400).send("Something went wrong")
    }

});

//delete the user
app.delete("/deleteUser", async (req, res) => {
    const userId = req.body.userId;

    try {
        const findUser = await User.findOne({ _id: userId })
        if (findUser) {
            await User.findByIdAndDelete({ _id: userId })
            res.send("user deleted successfully!")
        }
        res.status(400).send("User not found to delete")


    } catch (err) {
        res.status(400).send("Something went wrong!")

    }


})

//update the user
app.patch("/user/:userId", async (req, res) => {
    const userId = req?.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["skills", "photoUrl", "about", "age", "gender"]
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed")
        }
        if (data?.skills?.length > 10) {
            throw new Error("Max skills added are 10")
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after", runValidators: true });
        console.log(user);
        res.send("user updated successfully!")

    } catch (err) {
        res.status(400).send(err.message)

    }

})


connectDb()
    .then(() => {
        console.log("Database connection succeessful");
        app.listen(3000, () => {
            console.log("server is successfully listening on port: 3000....")
        });
    })
    .catch((err) => {
        console.error("Something went wrong while connecting to Db")
    })






