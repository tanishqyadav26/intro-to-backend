import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Import route handlers
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";

const app = express();

// Global Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Interactive Web Tester Route
app.get("/test", (req, res) => {
  res.sendFile("tester.html", { root: "public" });
});

// Health Check / Welcome route
app.get("/", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    success: true,
    message: "🚀 Backend API is running successfully on your laptop!",
    database: isDbConnected
      ? "Connected to MongoDB Atlas"
      : "Pending MongoDB URI in .env (add MONGODB_URI to connect to cloud)",
    endpoints: {
      users: "/api/v1/users",
      posts: "/api/v1/posts",
    },
  });
});

// Mount Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route Not Found`,
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
