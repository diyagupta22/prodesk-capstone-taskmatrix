// 🔥 Load environment variables FIRST
import dotenv from "dotenv";
dotenv.config();

// 🔥 Core imports
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// 🔥 Route imports
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// =====================================================
// 🔐 SECURITY MIDDLEWARE
// =====================================================

// Secure HTTP headers
app.use(helmet());

// Parse JSON bodies
app.use(express.json());

// =====================================================
// 🌐 CORS CONFIGURATION (LOCAL + ALL VERCEL DEPLOYMENTS)
// =====================================================

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://prodesk-capstone-taskmatrix-ojke.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, curl, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow localhost and explicitly listed domains
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow ALL Vercel deployments of this project
      if (
        origin.includes("prodesk-capstone-taskmatrix") &&
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      // Block everything else
      return callback(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// =====================================================
// 🚦 RATE LIMITERS
// =====================================================

// Global limiter for all routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: "Too many requests. Please try again later.",
  },
});

app.use(globalLimiter);

// Login/Register limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    error: "Too many login attempts. Please try again later.",
  },
});

// AI endpoint limiter
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    error: "AI request limit exceeded. Please try again later.",
  },
});

// =====================================================
// ❤️ HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// =====================================================
// 🛣️ ROUTES
// =====================================================

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);

// =====================================================
// ❌ 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// =====================================================
// 🍃 DATABASE CONNECTION
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
  })
  .catch((err) => {
    console.log("Mongo error ❌", err.message);
    process.exit(1);
  });

// =====================================================
// 🚀 START SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});