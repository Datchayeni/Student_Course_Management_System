const { rateLimit } = require("express-rate-limit");

// 10 login attempts per IP per 15 minutes.
// Note: for several production server instances use a shared store
// (e.g. rate-limit-redis) instead of this process-local memory.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Try again later.",
  },
});

module.exports = loginLimiter;
