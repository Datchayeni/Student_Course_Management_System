const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    // Set for notifications sent by an admin (chat alerts have none)
    title: {
      type: String,
      trim: true,
      maxlength: 100
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    audience: {
      type: String,
      trim: true
    },
    // Groups the copies created by one "send" so history can be shown
    batchId: {
      type: String,
      index: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

notificationSchema.index({
  recipient: 1,
  createdAt: -1
});

module.exports = mongoose.model("Notification", notificationSchema);