const validator = require("validator");

const SignUpAPI = (data) => {
  const { emailId, photoUrl, password } = data;
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Weak Password. You password should contain atleast One capital letter, One small letter, One special character and One number"
    );
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter valid Email Id");
  }
};

module.exports = SignUpAPI;
