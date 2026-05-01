// 🔥 Load env FIRST (before any imports!)
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";


import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";

const app = express();

// 🔥 Middleware
app.use(express.json());

// 🔥 CORS (safe for now)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// 🔥 Health check
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// 🔥 Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/protected", protectedRoutes);

// ❗ Debug 404 (must be LAST)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found ❌" });
});

// 🔥 Mongo connect (with better logs)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => {
    console.log("Mongo error ❌", err.message);
    process.exit(1);
  });

// 🔥 Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});