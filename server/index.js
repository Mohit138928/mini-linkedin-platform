const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration for production
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mini-linkedin-platform.vercel.app/", // Add your Vercel URL here later
      /\.vercel\.app$/, // Allow all Vercel preview deployments
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Mini LinkedIn API is running!",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      users: "/api/users",
      posts: "/api/posts",
      upload: "/api/upload",
    },
  });
});

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/mini-linkedin";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Don't exit process in production, let Render handle restarts
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

// Handle MongoDB connection events
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected. Attempting to reconnect...");
  if (process.env.NODE_ENV === "production") {
    connectDB();
  }
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});

// Routes with better error handling
try {
  const usersRouter = require("./routes/users");
  const postsRouter = require("./routes/posts");
  const uploadRouter = require("./routes/upload");

  app.use("/api/users", usersRouter);
  app.use("/api/posts", postsRouter);
  app.use("/api/upload", uploadRouter);

  console.log("✅ Routes loaded successfully");
} catch (error) {
  console.error("❌ Error loading routes:", error);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("🔄 SIGTERM received. Shutting down gracefully...");
  mongoose.connection.close(() => {
    console.log("✅ MongoDB connection closed.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("🔄 SIGINT received. Shutting down gracefully...");
  mongoose.connection.close(() => {
    console.log("✅ MongoDB connection closed.");
    process.exit(0);
  });
});

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
});

// Handle server errors
server.on("error", (error) => {
  console.error("❌ Server error:", error);
});

module.exports = app;
