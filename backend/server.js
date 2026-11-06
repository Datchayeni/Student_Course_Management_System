require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const mongoose = require("mongoose");

// Import database connection function
const connectDB = require("./config/db");
const initializeSocket = require("./config/socket");
const { corsOptions } = require("./config/cors");

// Import Routes
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Import Middleware
const notFound = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
const server = http.createServer(app);

// Behind a reverse proxy / load balancer (Render, Nginx...) set TRUST_PROXY=1
// so rate limiting sees the real client IP instead of the proxy's.
if (process.env.TRUST_PROXY) {
    app.set("trust proxy", Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);
}

// Initialize Socket.IO with the HTTP server
// (routes use it to push live notifications: req.app.get("io"))
const io = initializeSocket(server);
app.set("io", io);

// -------------------------
// Middleware (order matters)
// 1. security headers, CORS, logging, body parsing
// 2. API routes
// 3. unknown-route handler
// 4. centralized error handler
// -------------------------

app.use(helmet());

app.use(cors(corsOptions));

// "combined" logs method, URL, status, size, referrer and user agent.
// It never logs request bodies, so passwords and tokens stay out of the logs.
app.use(morgan("combined"));

app.use(express.json({ limit: "100kb" }));

app.use(express.urlencoded({
    extended: true,
    limit: "100kb"
}));


// -------------------------
// Test Route & Health Check
// -------------------------

app.get("/", (req, res) => {
    res.json({
        message: "Student Course Management API is running"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is healthy",
        timestamp: new Date().toISOString()
    });
});


// -------------------------
// API Routes
// -------------------------

app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/notifications", notificationRoutes);


// -------------------------
// 404 + Error Handling
// (must be registered last)
// -------------------------

app.use(notFound);
app.use(errorHandler);


// -------------------------
// Graceful shutdown + process-level error handling
// -------------------------

let shuttingDown = false;

async function shutdown(reason, exitCode = 0) {
    if (shuttingDown) {
        return;
    }
    shuttingDown = true;

    console.log(`Shutting down (${reason})...`);

    // Safety net: force exit if connections refuse to close
    const forceExit = setTimeout(() => {
        console.error("Forced shutdown after timeout");
        process.exit(exitCode || 1);
    }, 10000);
    forceExit.unref();

    try {
        // Stop accepting new connections, close sockets, let in-flight requests finish
        io.close();
        if (server.listening) {
            await new Promise((resolve) => server.close(resolve));
        }
        await mongoose.connection.close();
    } catch (error) {
        console.error("Error during shutdown:", error);
        exitCode = exitCode || 1;
    }

    process.exit(exitCode);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (error) => {
    console.error("Unhandled rejection:", error);
    shutdown("unhandledRejection", 1);
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
    shutdown("uncaughtException", 1);
});


// -------------------------
// Server & Database Startup
// -------------------------

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Wait for MongoDB to connect successfully before starting the HTTP/Socket server
        await connectDB();

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
}

startServer();
