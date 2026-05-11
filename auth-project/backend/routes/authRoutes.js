import express from "express";
import { registerUser, loginUser } from "../controller/authController.js";
import validate from "../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
} from "../schemas/authSchema.js";

const router = express.Router();

// Register route with validation
router.post("/register", validate(registerSchema), registerUser);

// Login route with validation
router.post("/login", validate(loginSchema), loginUser);

export default router;