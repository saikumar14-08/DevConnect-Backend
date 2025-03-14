const express = require("express");
const connectDB = require("./config/database");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const userAuth = require("./middleware/userAuth");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const User = require("./models/user");
const ConnectionRequest = require("./models/connectionrequest");
const UserRouter = require("./routes/userroute");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", UserRouter);

const PORT = 3000;

// Temp API just to check all the users table in postman
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Temp API just to check all the connectionrequests table in postman
app.get("/connReq", async (req, res) => {
  try {
    const data = await ConnectionRequest.find({});
    res.send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () =>
      console.log(`Server successfully listening to port ${PORT}`)
    );
  })
  .catch((e) => console.log("Something went wrong"));
