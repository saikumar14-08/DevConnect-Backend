const express = require("express");
const user = require("./models/user");
const connectDB = require("./config/database");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const reqBody = new user(req.body);
  console.log(reqBody);

  try {
    await reqBody.save();
    res.send("User added successfully");
  } catch (e) {
    console.error("User cannot be added");
  }
});

app.get("/user", async (req, res) => {
  const lastName = await req.body.lastName;
  const resUser = await user.find({ lastName: lastName });
  try {
    resUser ? res.send(resUser) : res.send("No user matched");
  } catch (e) {
    console.log("/user error");
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

app.patch("/user", async (req, res) => {
  try {
    const patchId = await req.body._id;
    const data = await req.body;
    const patchQuery = await user.findByIdAndUpdate({ _id: patchId }, data);
    res.send("User Patched successfully");
  } catch (err) {
    res.status(500).send("User patch not working");
  }
});

const PORT = 3002;
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () =>
      console.log(`Server successfully listening to port ${PORT}`)
    );
  })
  .catch((e) => console.log("Something went wrong"));
