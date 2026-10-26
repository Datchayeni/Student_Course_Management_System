const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");
const students = require("../data/students");

async function registerStudent({ name, email, password, department }) {
  const normalizedEmail = email.trim().toLowerCase();
  if (students.find(s => s.email === normalizedEmail)) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const student = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    department: department.trim(),
    createdAt: new Date().toISOString(),
  };
  students.push(student);
  return { id: student.id, name: student.name, email: student.email, department: student.department };
}

async function loginStudent({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const student = students.find(s => s.email === normalizedEmail);
  if (!student || !(await bcrypt.compare(password, student.passwordHash))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  return { id: student.id, name: student.name, email: student.email, department: student.department };
}

module.exports = { registerStudent, loginStudent };