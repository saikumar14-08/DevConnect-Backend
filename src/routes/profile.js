const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middleware/userAuth");
const { ValidateEditableFields } = require("../utils/userValidation");
const bcrypt = require("bcrypt");
const { isStrongPassword } = require("validator");
const User = require("../models/user");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!ValidateEditableFields(req)) throw new Error("Invalid edit request");
    else {
      Object.keys(req.body).forEach((key) => {
        req.user[key] = req.body[key];
      });
      await req.user.save();
      res.send(req.user);
    }
  } catch (err) {
    res.send(err.message);
  }
});

profileRouter.patch("/profile/changepassword", userAuth, async (req, res) => {
  try {
    const validatePwd = isStrongPassword(req.body.password);
    if (!validatePwd) throw new Error("Need strong Password");
    else {
      const encryptPwd = await bcrypt.hash(req.body.password, 10);
      req.user.password = encryptPwd;
      await req.user.save();
      res.send("Password changed successfully");
    }
  } catch (err) {
    res.send(err.message);
  }
});

profileRouter.patch("/profile/forgotpassword", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    let user = await User.findOne({ emailId });
    if (user) {
      const encryptPwd = await bcrypt.hash(password, 10);
      user.password = encryptPwd;
    } else {
      throw new Error("User email not found");
    }
    await user.save();
    res.send("Password changed successfully");
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = profileRouter;
