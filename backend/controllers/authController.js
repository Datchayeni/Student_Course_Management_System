const authService = require("../services/authService");
const jwt = require("jsonwebtoken");

async function register(req, res, next) {
  try {
    const student = await authService.registerStudent(req.body || {});
    return res.status(201).json({ message: "Student registered successfully", student });
  } catch (error) {
    next(error);
  }
}

async function registerAdmin(req, res, next) {
  try {
    const admin = await authService.registerAdmin(req.body || {});
    return res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const student = await authService.loginStudent(req.body || {});

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      { email: student.email, role: student.role },
      process.env.JWT_SECRET,
      {
        subject: String(student.id),
        expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || "1d",
        algorithm: "HS256",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      tokenType: "Bearer",
      student,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, registerAdmin, login };
