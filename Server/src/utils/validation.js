const validator = require("validator");

// ✅ FIXED: now accepts data directly (NOT req)
const validateSignUpData = (data) => {
  const { firstName, lastName, emailId, password } = data;

  if (!firstName || firstName.length < 4) {
    throw new Error("First name must be at least 4 characters");
  }

  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  }

  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};