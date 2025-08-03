const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Test route to verify router is working
router.get("/test", (req, res) => {
  res.json({
    message: "Users router is working!",
    timestamp: new Date().toISOString(),
  });
});

// Get all users (for testing)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}).select("-__v");
    res.json({
      message: "Users fetched successfully",
      count: users.length,
      users: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    // console.log("User search query:", q); // Debug log

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const searchQuery = q.trim();
    // console.log("Searching for users with name containing:", searchQuery);

    // Search users by name (case-insensitive)
    const users = await User.find({
      name: { $regex: searchQuery, $options: "i" },
    })
      .select("firebaseUid name headline bio profilePicture")
      .limit(10);

    // console.log(`Found ${users.length} users:`, users.map((u) => u.name));
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Failed to search users" });
  }
});

// Debug route for temporary use
// This route is for debugging purposes only and should not be used in production
router.get("/debug/all", async (req, res) => {
  try {
    const users = await User.find({}).select("name firebaseUid").limit(5);
    // console.log("All users in database:", users);
    res.json({
      count: users.length,
      users: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

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
