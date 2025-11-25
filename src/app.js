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

// ---------- LOGGING SETUP ----------
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const logger = require("./utils/logger");

// Create logs folder if not present
if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

// Morgan HTTP access logs
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../logs/access.log"),
  { flags: "a" }
);

// Apply Morgan middleware
app.use(morgan("combined", { stream: accessLogStream }));

// ---------- CORS ----------
app.use(
  cors({
    origin: ["http://localhost:5173", "https://www.devconnekt.com"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ---------- ROUTES ----------
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", UserRouter);
app.use("/", paymentrouter);
app.use("/", chatRouter);

// ---------- SERVER + SOCKET ----------
const server = http.createServer(app);
socketInit(server);

// ---------- START SERVER ----------
connectDB()
  .then(() => {
    logger.info("Database connected successfully");

    server.listen(process.env.PORT, () => {
      logger.info(`Server listening on port ${process.env.PORT}`);
    });
  })
  .catch((e) => {
    logger.error("Database connection error: " + e.message);
  });
