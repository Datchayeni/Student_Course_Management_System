const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [100, "Course title cannot exceed 100 characters"]
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
      maxlength: [1000, "Course description cannot exceed 1000 characters"]
    },
    instructor: {
      type: String,
      required: [true, "Instructor name is required"],
      trim: true
    },
    duration: {
      type: String,
      required: [true, "Course duration is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: [0, "Price cannot be negative"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Course", courseSchema);