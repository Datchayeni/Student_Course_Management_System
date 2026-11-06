const bcrypt = require("bcryptjs");
const User = require("../models/User");

function badRequest(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    department: user.department,
    studentId: user.studentId,
    adminId: user.adminId,
    year: user.year,
    role: user.role,
  };
}

async function registerStudent({
  name,
  email,
  password,
  department,
  studentId,
  year,
}) {
  // Validate that required fields are present (and are strings, so that
  // .trim() below can never throw a TypeError -> 500)
  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof password !== "string" || !password
  ) {
    throw badRequest("Name, email, and password are required");
  }

  if (password.length < 12 || password.length > 72) {
    throw badRequest("Password must contain between 12 and 72 characters");
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if student already exists in MongoDB
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw badRequest("Email is already registered", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Public registration always creates a student. The role is never
  // taken from the request body.
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    department: typeof department === "string" ? department.trim() : "",
    studentId: typeof studentId === "string" ? studentId.trim() : "",
    year: typeof year === "string" ? year.trim() : "",
    role: "student",
  });

  return toPublicUser(user);
}

async function registerAdmin({ name, adminId, email, password, department }) {
  if (
    typeof name !== "string" || !name.trim() ||
    typeof adminId !== "string" || !adminId.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof password !== "string" || !password
  ) {
    throw badRequest("Name, admin ID, email, and password are required");
  }

  if (password.length < 12 || password.length > 72) {
    throw badRequest("Password must contain between 12 and 72 characters");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({
    $or: [
      { email: normalizedEmail },
      { role: "admin", adminId: adminId.trim() },
    ],
  });
  if (existing) {
    throw badRequest("An admin with this email or ID already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    department: typeof department === "string" ? department.trim() : "",
    adminId: adminId.trim(),
    role: "admin",
  });

  return toPublicUser(user);
}

async function loginStudent({ email, password }) {
  if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
    throw badRequest("Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Find student by email in MongoDB
  const user = await User.findOne({ email: normalizedEmail });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw badRequest("Invalid email or password", 401);
  }

  return toPublicUser(user);
}

module.exports = { registerStudent, registerAdmin, loginStudent };
