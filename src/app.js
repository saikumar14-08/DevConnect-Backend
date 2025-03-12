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

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

const PORT = 3000;

// Feed API is just to check all the db in postman
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (err) {
    res.status(500).send(err.message);
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
