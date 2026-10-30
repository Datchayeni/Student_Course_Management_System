const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");

// Import database connection function
const connectDB = require("./config/db");

// Import Routes
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Import Middleware
const notFound = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// -------------------------
// Middleware
// -------------------------

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(morgan("dev"));


// -------------------------
// Test Route
// -------------------------

app.get("/", (req, res) => {
    res.json({
        message: "Student Course Management API is running"
    });
});


// -------------------------
// Health Check
// -------------------------

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


// -------------------------
// 404 + Error Handling
// (must be registered last)
// -------------------------

app.use(notFound);
app.use(errorHandler);


// -------------------------
// Server & Database Startup
// -------------------------

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Wait for MongoDB to connect successfully before starting the server
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
}

startServer();