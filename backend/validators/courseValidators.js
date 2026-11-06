const { body, param, query } = require("express-validator");

const requiredText = (field, label, max) =>
  body(field)
    .isString()
    .withMessage(`${label} is required`)
    .bail()
    .trim()
    .notEmpty()
    .withMessage(`${label} is required`)
    .isLength({ max })
    .withMessage(`${label} cannot exceed ${max} characters`);

const courseBodyValidation = [
  requiredText("title", "Course title", 100),
  requiredText("description", "Course description", 1000),
  requiredText("instructor", "Instructor", 100),
  requiredText("duration", "Duration", 50),
  body("price")
    .exists({ values: "null" })
    .withMessage("Price is required")
    .bail()
    .isFloat({ min: 0, max: 10000000 })
    .withMessage("Price must be a number between 0 and 10,000,000")
    .toFloat(),
];

const mongoIdParam = (name = "id", label = "ID") =>
  param(name).isMongoId().withMessage(`Invalid ${label}`);

const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1, max: 100000 })
    .withMessage("page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100")
    .toInt(),
];

module.exports = {
  courseBodyValidation,
  mongoIdParam,
  paginationValidation,
};
