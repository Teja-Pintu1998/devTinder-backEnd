const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const authRouter = require("./auth");
const userRouter = express.Router();
const User = require("../models/user");

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "photoURL",
  "age",
  "gender",
  "about",
  "skills",
];

//get all the pending conection requests for the loggedIn user
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);
    //}).populate("fromUserId","firstName lastName");

    //here we will populate the fromUserId from the reference User and we will pass all the data that we needed like firstName and lastName in tis case. if we dont pass the second parameter, it will sent back the whole User object

    // if (!connectionRequests) {
    //     res.json({
    //         message: "No requests found",

    //     })

    // }

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Fetch connection requests where the status is "accepted"
    const connectionRequests = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA) // Populate fromUserId
      .populate("toUserId", USER_SAFE_DATA); // Populate toUserId

    if (!connectionRequests || connectionRequests.length === 0) {
      return res.json({ message: "No connections/matches found" });
    }

    // Map the connections to return the other user's data
    const data = connectionRequests.map((connection) => {
      // If logged-in user is the sender, return the receiver's details
      if (
        connection.fromUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return connection.toUserId;
      }
      // If logged-in user is the receiver, return the sender's details
      return connection.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    //user should see all other user cards except his own card,
    // cards with the status interest and already ignores -> his connections,
    // accepted and rejected his profile already
    //by the above conditions we can conclude that if the entry has been already created inthe connectionRequest collection -> if there is a entry of person A and person B they should not see the profile of each other irrespective of status.

    const loggedInUser = req.user;

    //if the user dont go to page 2 then the params are not passed in the URL so the default page would be 1 and default limit for the page 1 is 10

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page-1)*limit;

    //console.log(loggedInUser)
    //find all connection requests (sent + received)
    const connectionRequests = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId").skip(skip).limit(limit);

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // Fetching users excluding hidden ones and loggedIn user as well.
    //Also, the reason we write separate code to exclude loggedInUser Id is : If the logged-in user has no connections yet, their ID won't be in hideUsersFromFeed.
    //That means the logged-in user might appear in the feed if we don't explicitly exclude them.

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA);

    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
