const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  editCourse,
  removeCourse,
} = require("../controllers/courseController");
const {
  courseBodyValidation,
  mongoIdParam,
  paginationValidation,
} = require("../validators/courseValidators");
const validateRequest = require("../middleware/validateRequest");
const authenticateToken = require("../middleware/authMiddleware");

const { requireRole } = authenticateToken;

const router = express.Router();
const idCheck = [mongoIdParam("id", "course ID"), validateRequest];

// Anyone can read courses
router.get("/", paginationValidation, validateRequest, getCourses);
router.get("/:id", idCheck, getCourse);

// Only admins can change courses (students get 403)
router.post(
  "/",
  authenticateToken,
  requireRole("admin"),
  courseBodyValidation,
  validateRequest,
  addCourse
);

router.put(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  idCheck,
  courseBodyValidation,
  validateRequest,
  editCourse
);

router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  idCheck,
  removeCourse
);

module.exports = router;
