const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const upload = require("../upload"); // 🔥 ADD THIS

// ================= GET PROFILE =================
profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// ================= EDIT PROFILE =================
profileRouter.patch(
  "/edit",
  userAuth,
  upload.single("photo"), // 🔥 ADD THIS
  async (req, res) => {
    try {
      if (!validateEditProfileData(req)) {
        throw new Error("Invalid Edit Request");
      }

      const loggedInUser = req.user;
      const updates = req.body;

      // 🔥 skills fix (string → array)
      if (updates.skills) {
        try {
          updates.skills = JSON.parse(updates.skills);
        } catch {
          updates.skills = [];
        }
      }

      // 🔥 photo upload handling
      if (req.file) {
        const BASE_URL =
          process.env.NODE_ENV === "production"
            ? "https://devtinder-ksq6.onrender.com"
            : "http://localhost:5000";

        updates.photoUrl = `${BASE_URL}/uploads/${req.file.filename}`;
      }

      // 🔥 apply updates
      Object.keys(updates).forEach((key) => {
        loggedInUser[key] = updates[key];
      });

      await loggedInUser.save();

      res.json({
        message: `${loggedInUser.firstName}, profile updated successfully`,
        data: loggedInUser,
      });

    } catch (err) {
      console.error(err);
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = profileRouter;