const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get user profile
router.get("/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update user profile
router.post("/", async (req, res) => {
  try {
    const { firebaseUid, email, name, bio, headline, profilePicture } =
      req.body;

    let user = await User.findOne({ firebaseUid });

    if (user) {
      // Update existing user
      user.name = name || user.name;
      user.bio = bio !== undefined ? bio : user.bio;
      user.headline = headline !== undefined ? headline : user.headline;
      user.profilePicture =
        profilePicture !== undefined ? profilePicture : user.profilePicture;

      await user.save();
    } else {
      // Create new user
      user = new User({
        firebaseUid,
        email,
        name: name || "",
        bio: bio || "",
        headline: headline || "",
        profilePicture: profilePicture || "",
      });
      await user.save();
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Complete profile endpoint
router.post("/complete-profile", async (req, res) => {
  try {
    const { firebaseUid, name, headline, bio, profilePicture } = req.body;

    if (!name || !headline || !bio || !profilePicture) {
      return res.status(400).json({
        message:
          "All fields are required: name, headline, bio, and profile picture",
      });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.headline = headline;
    user.bio = bio;
    user.profilePicture = profilePicture;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user profile
router.put("/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const updates = req.body;

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    });

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
