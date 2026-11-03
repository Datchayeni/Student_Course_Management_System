const express = require("express");
const mongoose = require("mongoose");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:userId", authMiddleware, async (req, res, next) => {
  try {
    const myId = req.user.sub;
    const otherId = req.params.userId;

    if (!mongoose.isValidObjectId(myId) || !mongoose.isValidObjectId(otherId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const messages = await Message.find({
      $or: [
        { sender: myId, recipient: otherId },
        { sender: otherId, recipient: myId }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({ messages: messages.reverse() });
  } catch (error) {
    next(error);
  }
});

module.exports = router;