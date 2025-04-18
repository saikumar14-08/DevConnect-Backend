const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const UserRouter = require("./routes/userroute");
const paymentrouter = require("./routes/payment");
const socketInit = require("./utils/socket");
const chatRouter = require("./routes/chat");

require("./utils/cronJob");
require("dotenv").config();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: ["http://localhost:5173", "https://www.devconnekt.com"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", UserRouter);
app.use("/", paymentrouter);
app.use("/", chatRouter);

const server = http.createServer(app);
socketInit(server);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(process.env.PORT, () =>
      console.log(`Server successfully listening to port ${process.env.PORT}`)
    );
  })
  .catch((e) => console.log("Something went wrong"));
