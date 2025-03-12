const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, minLength: 1, maxLength: 50 },
    lastName: { type: String, minLength: 1, maxLength: 50 },
    age: {
      type: Number,
      required: true,
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

userSchema.methods.getJWT = async function () {
  /**As we are using this in the schema methods make sure you use anonymous functions/function expressions
   * but do not use arrow functions because of scoping issues.
   */
  const user = this;
  const token = jwt.sign({ _id: user._id }, "Sai@1999", { expiresIn: "1h" });
  return token;
};

userSchema.methods.decryptPwd = async function (password) {
  const user = this;
  const decryptPwd = await bcrypt.compare(password, user.password);
  return decryptPwd;
};

userSchema.index({ firstName: 1, lastName: 1 });
const User = mongoose.model("User", userSchema);
module.exports = User;
