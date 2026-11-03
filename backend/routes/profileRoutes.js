const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const {
  getProfile,
  updateProfile
} = require("../controllers/profileController");

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);

// List of other users the logged-in user can chat with
router.get("/students", authMiddleware, async (req, res, next) => {
  try {
    const students = await User.find({ _id: { $ne: req.user.sub } })
      .select("_id name email role department")
      .sort({ role: 1, name: 1 }) // admins first, then students A-Z
      .limit(200);
    res.json({ students });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
