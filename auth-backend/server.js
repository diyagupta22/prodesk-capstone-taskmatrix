const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 🔹 AUTH ROUTES
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// 🔹 PROTECTED ROUTE (NEW 🔥)
const auth = require("./middleware/auth");

app.get("/api/dashboard", auth, (req, res) => {
    res.send("Welcome Diya 🔐 Protected Data");
});

// 🔹 TEST ROUTE
app.get("/", (req, res) => {
    res.send("API running...");
});

// 🔹 SERVER START
app.listen(5000, () => console.log("Server running on port 5000"));