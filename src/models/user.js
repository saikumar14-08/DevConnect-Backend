const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, minLength: 1, maxLength: 50 },
    lastName: { type: String, minLength: 1, maxLength: 50 },
    age: {
      type: Number,
      required: true,
      validate: (val) => val > 18 && val < 100,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    gender: {
      type: String,
      validate: (val) => {
        if (!["male", "female"].includes(val))
          throw new Error("Select the God given gender");
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/5/Profile-Male-Transparent.png",
    },
    about: {
      type: String,
      default: "This is default about section",
      maxLength: 500,
    },
    skills: { type: [String], validate: (val) => val.length < 50 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
