const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.ObjectId,
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.ObjectId,
      require: true,
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "ignored", "rejected", "requested"],
        message: "Invalid Status: {VALUE} ",
      },
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
/**The below is compound indexing and we can give indexes to field which we use most.
 * This makes our query faster and it also comes with a cost.
 */
connectionRequestSchema.index({ fromUserId: 1, toUserId: 2 });
connectionRequestSchema.pre("save", function (next) {
  let connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId))
    throw new Error("You cannot send request to yourself");
  next();
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
