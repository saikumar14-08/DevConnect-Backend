const express = require("express");
const userAuth = require("../middleware/userAuth");
const UserRouter = express.Router();
const ConnectionRequest = require("../models/connectionrequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl gender age about skills";
UserRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const { _id, firstName } = req.user;

    const fromUsers = await ConnectionRequest.find({
      $or: [{ fromUserId: _id }, { toUserId: _id }],
      status: "accepted",
      // }).populate("fromUserId", ["firstName", "lastName"]); OR we can use:
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    if (!fromUsers.length)
      return res.json({
        message: `Hey ${firstName}, no connection requests yet!`,
      });
    const data = fromUsers.map((field) => {
      if (field.fromUserId._id.equals(_id)) {
        return field.toUserId;
      } else return field.fromUserId;
    });
    // res.send(data);
    res.json({
      message: "Hi " + firstName + "!! here are your connections.",
      data,
    });
  } catch (e) {
    res.status(500).send(e + " NO Users");
  }
});

UserRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const { _id, firstName } = req.user;
    const fromUsers = await ConnectionRequest.find({
      toUserId: _id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    if (!fromUsers.length)
      return res.send(`Hey ${firstName}, no connection requests yet!`);
    res.send(fromUsers);
  } catch (e) {
    res.status(500).send(e + " NO Users");
  }
});
/**
 * page: 1  -  1-10  -> skip(0)  limit(10)
 * page: 2  -  11-20 -> skip(10) limit(10)
 * page: 3  -  21-30 -> skip(20) limit(10)
 * skip = page*limit - limit => (limit-1)*page
 */
UserRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const { _id } = req.user;
    const page = parseInt(req?.query?.page);
    const limit = parseInt(req?.query?.limit);

    const connectTransactions = await ConnectionRequest.find({
      $or: [{ fromUserId: _id }, { toUserId: _id }],
    }).select("fromUserId toUserId");
    const uniqueIds = new Set();
    connectTransactions.forEach((id) => {
      uniqueIds.add(id.fromUserId.toString());
      uniqueIds.add(id.toUserId.toString());
    });

    const userCards = User.find({
      _id: { $nin: [...Array.from(uniqueIds), _id] },
    }).select(USER_SAFE_DATA);
    let skipVal = (page - 1) * limit;
    const data = await userCards.skip(skipVal).limit(limit);
    res.json(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
module.exports = UserRouter;
