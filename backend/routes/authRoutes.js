const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  registerValidation,
  adminRegisterValidation,
  loginValidation,
} = require("../validators/authValidators");
const validateRequest = require("../middleware/validateRequest");
const loginLimiter = require("../middleware/loginLimiter");

router.post(
  "/register",
  registerValidation,
  validateRequest,
  authController.register
);

router.post(
  "/admin/register",
  adminRegisterValidation,
  validateRequest,
  authController.registerAdmin
);

router.post(
  "/login",
  loginLimiter,
  loginValidation,
  validateRequest,
  authController.login
);

module.exports = router;
