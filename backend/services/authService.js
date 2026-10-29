const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function registerStudent({ name, email, password, department }) {
  const normalizedEmail = email.trim().toLowerCase();
  
  // Check if student already exists in MongoDB
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  
  // Create and save new user document in MongoDB
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    department: department.trim(),
  });

  return { 
    id: user._id, 
    name: user.name, 
    email: user.email, 
    department: user.department 
  };
}

async function loginStudent({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  
  // Find student by email in MongoDB
  const user = await User.findOne({ email: normalizedEmail });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return { 
    id: user._id, 
    name: user.name, 
    email: user.email, 
    department: user.department 
  };
}

module.exports = { registerStudent, loginStudent };