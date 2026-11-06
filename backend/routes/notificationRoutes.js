const express = require("express");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const validateRequest = require("../middleware/validateRequest");
const { mongoIdParam } = require("../validators/courseValidators");
const { body } = require("express-validator");

const { requireRole } = authMiddleware;

const router = express.Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.sub
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({ notifications });
  } catch (error) {
    next(error);
  }
});

// Admin: send a notification to all students, one department or one student.
// Each student gets a saved copy and, if online, it arrives instantly.
router.post("/send", authMiddleware, requireRole("admin"),
  body("audience").optional().isString().withMessage("Invalid audience").bail().isLength({ max: 150 }).withMessage("Audience is too long"),
  validateRequest,
  async (req, res, next) => {
  try {
    const { title, message, audience } = req.body || {};

    if (
      typeof title !== "string" || !title.trim() || title.trim().length > 100 ||
      typeof message !== "string" || !message.trim() || message.trim().length > 400
    ) {
      return res.status(400).json({
        message: "Title (max 100 characters) and message (max 400 characters) are required"
      });
    }

    const filter = { role: "student" };
    let label = "All Students";

    if (typeof audience === "string" && audience && audience !== "all") {
      if (audience.startsWith("student:")) {
        const studentId = audience.slice("student:".length);
        if (!mongoose.isValidObjectId(studentId)) {
          return res.status(400).json({ message: "Invalid student" });
        }
        filter._id = studentId;
      } else {
        filter.department = audience;
        label = audience;
      }
    }

    const recipients = await User.find(filter).select("_id name");

    if (recipients.length === 0) {
      return res.status(404).json({ message: "No students match this audience" });
    }

    if (filter._id) {
      label = recipients[0].name;
    }

    const batchId = new mongoose.Types.ObjectId().toString();

    const created = await Notification.insertMany(
      recipients.map((student) => ({
        recipient: student._id,
        sender: req.user.sub,
        title: title.trim(),
        message: message.trim(),
        audience: label,
        batchId
      }))
    );

    const io = req.app.get("io");
    if (io) {
      created.forEach((item) => {
        io.to(`user:${item.recipient}`).emit("new_notification", item);
      });
    }

    res.status(201).json({
      message: "Notification sent",
      delivered: created.length,
      batchId
    });
  } catch (error) {
    next(error);
  }
});

// Admin: history of what this admin has sent
router.get("/sent", authMiddleware, requireRole("admin"), async (req, res, next) => {
  try {
    const sent = await Notification.aggregate([
      { $match: { sender: new mongoose.Types.ObjectId(req.user.sub) } },
      {
        $group: {
          _id: "$batchId",
          title: { $first: "$title" },
          message: { $first: "$message" },
          audience: { $first: "$audience" },
          createdAt: { $first: "$createdAt" },
          delivered: { $sum: 1 },
          read: { $sum: { $cond: ["$isRead", 1, 0] } }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 50 }
    ]);

    res.json({ sent });
  } catch (error) {
    next(error);
  }
});

router.patch("/read-all", authMiddleware, async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.sub, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/read", authMiddleware, mongoIdParam("id", "notification ID"), validateRequest, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.sub },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ notification });
  } catch (error) {
    next(error);
  }
});

module.exports = router;