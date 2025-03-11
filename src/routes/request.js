const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middleware/userAuth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const userFirstName = req.user.firstName;
    if (!req.user) res.status(401).send("Token expored");
    res.send(`${userFirstName} sent connection request`);
  } catch (e) {
    res.status(500).send("Error sending connection request");
  }
});

module.exports = requestRouter;
