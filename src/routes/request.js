const express = require("express");
const mongoose = require("mongoose")
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const connectionRequest = require("../models/connectionRequest")

//sending connection request API

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }


        // if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        //     return res.status(400).json({
        //         message: "Invalid toUserId format",
        //     });
        // }

        // written the below logic as pre save method on connectionRequest.js file
        // if (fromUserId.toString() === toUserId) {
        //     return res.status(400).json({
        //         message: "You cannot send a connection request to yourself",
        //     });
        // }

        const toUser = await User.findById(toUserId)
        if (!toUser) {
            return res.status(400).json({
                message: "User not found"
            });
        }


        const existingConnectionRequest = await connectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ]
        });
        if (existingConnectionRequest) {
            return res.status(400).send("Connection request already exists")
        }

        //creating a new document below
        const newConnectionRequest = new connectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await newConnectionRequest.save();

        (status === "interested") ?
            res.json({
                message: "You are interested in " + toUser.firstName + "'s profile",
                data
            }) :
            res.json({
                message: "You ignored - " + toUser.firstName + "'s profile",
                data
            })
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
}

)

module.exports = requestRouter;