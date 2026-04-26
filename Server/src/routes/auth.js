const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/user");
const upload = require("../upload");
const { validateSignUpData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");

// ================= COOKIE CONFIG =================
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  path: "/",
  expires: new Date(Date.now() + 8 * 3600000),
};

// ================= BASE URL =================
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://devtinder-ksq6.onrender.com"
    : "http://localhost:5000";

// ================= SIGNUP =================
authRouter.post("/signup", upload.single("photo"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // ✅ FIXED
    validateSignUpData(req.body);

    const { firstName, lastName, emailId, password } = req.body;

    // 🔒 Check duplicate email
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send("Email already exists");
    }

    // 🔐 Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 📸 Photo URL
    const photoUrl = req.file
      ? `${BASE_URL}/uploads/${req.file.filename}`
      : "";

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      photoUrl,
    });

    const savedUser = await user.save();

    const token = await savedUser.getJWT();

    res.cookie("token", token, COOKIE_OPTIONS);

    const userResponse = savedUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "User Added successfully!",
      data: userResponse,
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err.message);
    return res.status(500).send(err.message);
  }
});

// ================= LOGIN =================
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    if (!emailId || !password) {
      return res.status(400).send("Missing credentials");
    }

    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials");
    }

    const token = await user.getJWT();

    res.cookie("token", COOKIE_OPTIONS);

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.json(userResponse);

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    return res.status(500).send(err.message);
  }
});

// ================= LOGOUT =================
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now()),
  });

  res.send("Logout Successful!");
});

// ================= PROFILE =================
authRouter.get("/profile", userAuth, async (req, res) => {
  res.send(req.user);
});

module.exports = authRouter;