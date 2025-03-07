const mongoose = require("mongoose");

const connectionString =
  "mongodb+srv://Sai_learn_node:0jbNsaFJZ60hStQW@devtinder.o92z6.mongodb.net/?retryWrites=true&w=majority&appName=DevTinder";

const connectDB = async () => {
  await mongoose.connect(connectionString);
};

module.exports = connectDB;
