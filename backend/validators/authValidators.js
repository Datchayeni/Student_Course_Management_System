const { body } = require("express-validator");

// Email is only trimmed + lower-cased (same as authService does).
// We deliberately do NOT use normalizeEmail() with its defaults: it strips
// dots from Gmail addresses, so "john.doe@gmail.com" would be stored as
// "johndoe@gmail.com" and the user could no longer log in with what they typed.
const emailRule = body("email")
  .isString()
  .withMessage("Valid email is required")
  .bail()
  .trim()
  .isEmail()
  .withMessage("Valid email is required")
  .bail()
  .isLength({ max: 254 })
  .withMessage("Email is too long")
  .toLowerCase();

// bcrypt only uses the first 72 bytes, so longer passwords add nothing.
const newPasswordRule = body("password")
  .isString()
  .withMessage("Password is required")
  .bail()
  .isLength({ min: 12, max: 72 })
  .withMessage("Password must contain between 12 and 72 characters");

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

const optionalText = (field, label, max) =>
  body(field)
    .optional({ values: "falsy" })
    .isString()
    .withMessage(`${label} must be text`)
    .bail()
    .trim()
    .isLength({ max })
    .withMessage(`${label} cannot exceed ${max} characters`);

const registerValidation = [
  requiredText("name", "Name", 100),
  emailRule,
  newPasswordRule,
  optionalText("department", "Department", 100),
  optionalText("studentId", "Student ID", 50),
  optionalText("year", "Year", 20),
];

const adminRegisterValidation = [
  requiredText("name", "Name", 100),
  requiredText("adminId", "Admin ID", 50),
  emailRule,
  newPasswordRule,
  optionalText("department", "Department", 100),
];

// Login does not enforce the new 12-character rule, so accounts created
// before this change can still sign in.
const loginValidation = [
  emailRule,
  body("password")
    .isString()
    .withMessage("Password is required")
    .bail()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ max: 1000 })
    .withMessage("Password is too long"),
];

module.exports = {
  registerValidation,
  adminRegisterValidation,
  loginValidation,
};
