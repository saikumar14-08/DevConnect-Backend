const express = require("express");
const connectDB = require("./config/database");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const userAuth = require("./middleware/userAuth");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const UserRouter = require("./routes/userroute");
const cors = require("cors");
require("./utils/cronJob");
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", UserRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(process.env.PORT, () =>
      console.log(`Server successfully listening to port ${process.env.PORT}`)
    );
  })
  .catch((e) => console.log("Something went wrong"));
