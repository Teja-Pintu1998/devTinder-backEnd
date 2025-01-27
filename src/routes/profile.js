const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {validateProfileEditData} = require("../utils/validation")

//get profile API
profileRouter.get("/profile/view", userAuth, (req, res) => {
    try {
        const user = req.user;
        res.send(user);

    } catch (err) {
        res.status(500).send("Error: " + err.message);

    }

})

//get profile edit API
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateProfileEditData(req)){
            throw new Error("Invalid edit request")
        }

        const loggedInUser = req.user;

        // loggedInUser.firstName = req.body.firstName;
        // loggedInUser.lastName = req.body.lastName;
        // loggedInUser.gender = req.body.gender;

        Object.keys(req.body).forEach((k)=>loggedInUser[k] = req.body[k]);
        //console.log(loggedInUser)
        await loggedInUser.save();

        //good way of sending the response
        res.json({
            message : `Your profile was successfully updated - ${loggedInUser.firstName}`,
            data: loggedInUser
        })

        //res.send(`Your profile was successfully updated - ${loggedInUser.firstName}`)


    } catch (err) {
        res.status(400).send("Error: " + err.message);

    }
})

//profileRouter.patch("/profile/password", (req,res)=>{})

 











module.exports = profileRouter;