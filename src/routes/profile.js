const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middleware/userAuth");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = profileRouter;
