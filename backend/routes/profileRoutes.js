const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const {
  getProfile,
  updateProfile
} = require("../controllers/profileController");

router.get("/", authMiddleware, getProfile);
router.put(
  "/",
  authMiddleware,
  body("name")
    .isString()
    .withMessage("Valid name is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Valid name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  validateRequest,
  updateProfile
);

// List of other users the logged-in user can chat with
router.get("/students", authMiddleware, async (req, res, next) => {
  try {
    const students = await User.find({ _id: { $ne: req.user.sub } })
      .select("_id name email role department")
      .sort({ role: 1, name: 1 }) // admins first, then students A-Z
      .limit(200)
      .lean();
    res.json({ students });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
