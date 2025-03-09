const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    age: { type: Number, required: true },
    emailId: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
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
    about: { type: String, default: "This is default about section" },
    skills: [{ type: String }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
