const express = require("express");
const user = require("./models/user");
const connectDB = require("./config/database");
const app = express();

const PORT = 3002;

app.post("/signup", (req, res) => {
  const data = new user({
    firstName: "pooja",
    lastName: "Boreddy",
    age: 26,
  });
  data.save();
  res.send("User added successfully");
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () =>
      console.log(`Server successfully listening to port ${PORT}`)
    );
  })
  .catch((e) => console.log("Something went wrong"));
