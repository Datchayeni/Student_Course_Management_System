// Single source of truth for trusted browser origins.
// Used by both Express (CORS) and Socket.IO so they never drift apart.
// CLIENT_URL may hold several comma-separated origins.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // No Origin header = non-browser client (curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(
      Object.assign(new Error("Origin not allowed by CORS"), { status: 403 })
    );
  },
  credentials: true,
};

module.exports = { allowedOrigins, corsOptions };
