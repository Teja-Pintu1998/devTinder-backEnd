const express = require("express");
const app = express();
const { connectDb } = require("./config/database");



const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);




























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






