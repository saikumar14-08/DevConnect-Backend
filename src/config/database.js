const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = process.env.DB_CONNECTION_STRING;

const connectDB = async () => {
  await mongoose.connect(connectionString);
};

module.exports = connectDB;
