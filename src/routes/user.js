const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const userRouter = express.Router()


//get all the pending conection requests for the loggedIn user
userRouter.get("/user/requests", userAuth, async (req, res) => {


    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"



        }).populate("fromUserId", ["firstName", "lastName","photoURL","age","gender","about","skills"]);
        //}).populate("fromUserId","firstName lastName");

        //here we will populate the fromUserId from the reference User and we will pass all the data that we needed like firstName and lastName in tis case. if we dont pass the second parameter, it will sent back the whole User object




        // if (!connectionRequests) {
        //     res.json({
        //         message: "No requests found",

        //     })

        // }

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        })




    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }

})



















module.exports = userRouter;