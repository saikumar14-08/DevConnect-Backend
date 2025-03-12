const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middleware/userAuth");
const ConnectionRequest = require("../models/connectionrequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const toUserCheck = await User.findById({ _id: toUserId });
      // Did the same check at schema level
      // if (fromUserId.equals(toUserId)) {
      //   return res.status(401).send("You're sending request to yourself");
      // }
      if (!toUserCheck)
        return res.status(401).send("The requested user not found");
      const allowedStatus = ["ignored", "accepted"];
      if (allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionRequest)
        return res.status(400).send("Please resolve the existing connection");
      const connectionReq = await new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionReq.save();
      res.json({
        message: `Connection ${status}. From ${req.user.firstName} to ${toUserCheck.firstName}`,
        data: req.user,
      });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

module.exports = requestRouter;
