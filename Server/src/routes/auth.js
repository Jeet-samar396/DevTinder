const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const upload = require("../upload");

// COMMON COOKIE CONFIG
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  expires: new Date(Date.now() + 8 * 3600000),
};

// ================= SIGNUP =================
authRouter.post("/signup", upload.single("photo"), async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // 🔒 Check duplicate email
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // 🔐 Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 📸 Photo URL
    const photoUrl = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : "";

    // 👤 Create user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      photoUrl,
    });

    const savedUser = await user.save();

    // 🎟️ Generate token
    const token = await savedUser.getJWT();

    res.cookie("token", token, COOKIE_OPTIONS);

    // ❌ Remove password before sending
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.json({
      message: "User Added successfully!",
      data: userResponse,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// ================= LOGIN =================
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // 🔍 DEBUG LOGS
    console.log("INPUT EMAIL:", emailId);
    console.log("INPUT PASSWORD:", password);

    const user = await User.findOne({ emailId: emailId });
    console.log("USER FOUND:", user);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    console.log("PASSWORD MATCH:", isPasswordValid);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // IMPORTANT for localhost
  path: "/",     // ensure accessible everywhere
  expires: new Date(Date.now() + 8 * 3600000),
});

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);

  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
// ================= LOGOUT =================
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now()),
  });

  res.send("Logout Successful!!");
});
const { userAuth } = require("../middlewares/auth");

authRouter.get("/profile", userAuth, async (req, res) => {
  res.send(req.user);
});

module.exports = authRouter;