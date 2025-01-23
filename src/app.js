const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const User = require("./models/user");
const { ReturnDocument } = require("mongodb");
const { validateSignupData } = require("./utils/validation")
const bcrypt = require("bcrypt")
app.use(express.json());

//signup user
app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body
        //validating the user's data below
        validateSignupData(req)
        //the below line means you are creating a new instance (document) of the User model using the data provided in req.body.

        //encrypting the password

        const hash_Password = await bcrypt.hash((req?.body?.password), 10)
        req.body.password = hash_Password;
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

//login user
app.post("/login", async (req, res) => {

    try {
        const { emailId, password } = req.body;
        //finding for user exixtence
        const user = await User.findOne({ emailId })
        if (!user) {
            return res.status(400).send("Invalid credentials")
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).send("Invalid credentials")
        }
        res.send("login successfull for- !" + user.firstName)
    } catch (err) {
        return res.status(500).send("Error: " + err.message);

    }


})

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






