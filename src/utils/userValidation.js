const validator = require("validator");

const SignUpAPI = (data) => {
  const { emailId, photoUrl, password, age } = data;
  if (password && !validator.isStrongPassword(password)) {
    throw new Error(
      "Weak Password. You password should contain atleast One capital letter, One small letter, One special character and One number"
    );
  }
  if (emailId && !validator.isEmail(emailId)) {
    throw new Error("Enter valid Email Id");
  }
  if ((age && age < 18) || age > 120) {
    throw new Error("Age must be a valid number between 18 and 120.");
  }
  if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("Photo URL is not valid.");
  }
};

const ValidateEditableFields = (req) => {
  const editableFields = [
    "firstName",
    "lastName",
    "age",
    "emailId",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];
  /**Try to understand this Object.keys logic and work on similar tasks to improve understanding */
  const isEditable = Object.keys(req.body).every((field) =>
    editableFields.includes(field)
  );

  if (isEditable) SignUpAPI(req.body);
  return isEditable;
};

module.exports = { SignUpAPI, ValidateEditableFields };
