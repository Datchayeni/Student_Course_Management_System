const express = require("express");
const {
    getCourses,
    getCourse,
    addCourse,
    editCourse,
    removeCourse
} = require("../controllers/courseController");
const validateCourse = require("../middleware/courseValidation");

// 1. Add this import to fix the ReferenceError
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// GET all courses
router.get("/", getCourses);

// GET one course
router.get("/:id", getCourse);

// CREATE course
router.post("/", authenticateToken, validateCourse, addCourse);

// UPDATE course
router.put("/:id", authenticateToken, validateCourse, editCourse);

// DELETE course
router.delete("/:id", authenticateToken, removeCourse);

module.exports = router;