const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    // Optional: the register API treats department as optional, and a
    // required String field rejects "" -> registration used to fail
    // with a ValidationError whenever department was left empty.
    department: {
      type: String,
      trim: true,
      default: "",
    },
    // Only used by admin accounts (Admin ID from the admin register form)
    adminId: {
      type: String,
      trim: true,
      default: "",
    },
    // Used by the React profile page / admin lists
    studentId: {
      type: String,
      trim: true,
      default: "",
    },
    year: {
      type: String,
      trim: true,
      default: "",
    },
    // Several files (socket auth, profile controller) already select
    // "role", but the field did not exist in the schema.
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
