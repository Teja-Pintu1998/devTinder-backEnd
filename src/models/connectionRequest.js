const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        //reference to the User collection
        ref:"User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["interested", "ignored","accepted","rejected"],
            message: `{VALUE} is incorrect status type`
        },
        required: true
    }

}, { timestamps: true })

//compound Index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })



// Centralized validation logic: This rule is tied to the schema itself, so any operation (API or otherwise) that tries to save the document is subject to the same validation.
// Reduces redundancy if multiple routes or operations interact with the connectionRequest model.  Validation occurs within the model lifecycle and applies universally to all save operations

/* The primary difference is where the validation occurs:

Route Handler: Validation occurs before the save process starts, and you have full control over the HTTP response.
pre("save") Hook: Validation occurs within the model lifecycle and applies universally to all save operations, but requires explicit error handling in the calling code.*/






connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself")
    }
    next()

})

const connectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema); //its like creating a factory that helps in creating new documents

module.exports = connectionRequest;