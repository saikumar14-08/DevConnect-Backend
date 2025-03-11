const express = require("express");
const user = require("./models/user");
const connectDB = require("./config/database");
const { default: mongoose } = require("mongoose");
const SignUpAPI = require("./utils/userValidation");
const bcrypt = require("bcrypt");
const { trim } = require("validator");
const cookieParser = require("cookie-parser");
const app = express();
const userAuth = require("./middleware/userAuth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

    const hashedPwd = await bcrypt.hash(password, 10);

    SignUpAPI(req.body);
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
    res.send("User added successfully");
  } catch (e) {
    res.status(500).send("User cannot be Added: " + e);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const emailCheck = await user.findOne({ emailId: emailId });
    if (!emailCheck) throw new Error("Invalid email ID.");

    const pwdCheck = await emailCheck.decryptPwd(password);
    console.log(pwdCheck);

    if (pwdCheck) {
      const token = await emailCheck.getJWT();
      res.cookie("usercookie", token);
      if (token) res.send("Logged In successfully");
    } else throw new Error("Invalid Password");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post("/connectionRequest", userAuth, async (req, res) => {
  try {
    const userFirstName = req.user.firstName;
    if (!req.user) res.status(401).send("Token expored");
    res.send(`${userFirstName} sent connection request`);
  } catch (e) {
    res.status(500).send("Error sending connection request");
  }
});

app.get("/feed", async (req, res) => {
  const allUsers = await user.find({});
  try {
    !allUsers ? res.status(500).send("No Data in DB") : res.send(allUsers);
  } catch (err) {
    console.error("/feed Error");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const delId = await req.body._id;
    const deletedUser = await user.findByIdAndDelete({ _id: delId });
    res.send("User deleted successfully");
  } catch (err) {
    res.status(500).send("Deleting unsuccessful");
  }
});

app.patch("/user/:patchId", async (req, res) => {
  const patchId = await req.params?.patchId;
  const data = await req.body;

  try {
    const EDITABLE_FIELDS = ["lastName", "photoUrl", "about", "age", "skills"];
    const isUpdateAllowd = Object.keys(data).every((k) =>
      EDITABLE_FIELDS.includes(k)
    );
    if (!isUpdateAllowd) throw new Error("Update not allowed");
    else {
      const patchQuery = await user.findByIdAndUpdate(patchId, data, {
        runValidators: true,
      });
      res.send("User Patched successfully");
    }
  } catch (err) {
    res.status(500).send("User patch not working");
  }
});

// app.patch("/user", async (req, res) => {
//   const emailId = await req.body.emailId;
//   const data = await req.body;
//   try {
//     const updatedData = await user.findOneAndUpdate({ emailId }, data);
//     res.send("Updated using email ID ");
//   } catch (e) {
//     res.status(500).send("Update using email unsuccessful");
//   }
// });
const PORT = 3000;
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () =>
      console.log(`Server successfully listening to port ${PORT}`)
    );
  })
  .catch((e) => console.log("Something went wrong"));
