const validator = require("validator");

// ================= SIGNUP VALIDATION =================
const validateSignUpData = (data) => {
  const { firstName, lastName, emailId, password } = data;

  // First Name
  if (!firstName || firstName.trim().length < 3) {
    throw new Error("First name must be at least 3 characters");
  }

  // Email
  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  }

  // Password (🔥 simplified rule)
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
};

// ================= EDIT PROFILE VALIDATION =================
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

  return Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};