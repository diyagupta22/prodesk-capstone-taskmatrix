const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ MIDDLEWARES
app.use(express.json());

// 🔥 CORS FIX (IMPORTANT)
app.use(cors({
  origin: "https://prodesk-capstone-taskmatrix-five.vercel.app", // 👉 apna frontend link
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ MONGODB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ ROUTES
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// 🔐 PROTECTED ROUTE
const auth = require("./middleware/auth");

app.get("/api/dashboard", auth, (req, res) => {
  res.send("Welcome Diya 🔐 Protected Data");
});

// ✅ ROOT CHECK
app.get("/", (req, res) => {
  res.send("API running...");
});

// ✅ SERVER START
app.listen(5000, () => console.log("Server running on port 5000"));