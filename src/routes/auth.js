const express = require("express");
const bcrypt = require("bcrypt");
const { SignUpAPI } = require("../utils/userValidation");
const authRouter = express.Router();
const user = require("../models/user");
const { trim } = require("validator");
const logger = require("../utils/logger");

authRouter.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      photoUrl,
      about,
      skills,
    } = req.body;

    SignUpAPI(req.body);
    const hashedPwd = await bcrypt.hash(password, 10);

    const reqBody = new user({
      firstName,
      lastName,
      emailId: trim(emailId),
      age,
      password: hashedPwd,
      photoUrl,
      about,
      skills,
    });

    await reqBody.validate();
    await reqBody.save();
    const token = await reqBody.getJWT();
    res.cookie("usercookie", token);
    res.json(reqBody);
  } catch (e) {
    res.status(500).send("User cannot be Added: " + e);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const emailCheck = await user.findOne({ emailId: emailId });
    if (!emailCheck) {    
      logger.error("Invalid email ID attempt for email: " + emailId);
      throw new Error("Invalid email ID.");
    }
    const pwdCheck = await emailCheck.decryptPwd(password);
    if (pwdCheck) {
      const token = await emailCheck.getJWT();
      res.cookie("usercookie", token);
      if (token) res.send(emailCheck);
    } else{
      logger.error(`Invalid Password attempt for user: ${emailId}`);
      throw new Error("Invalid Password");
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("usercookie", null, { expires: new Date(Date.now()) });
  logger.info("User logged out successfully");
  res.send("Logged out successfully");
});
module.exports = authRouter;
