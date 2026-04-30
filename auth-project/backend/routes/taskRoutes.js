import express from "express";
import Task from "../models/Task.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/", authMiddleware, async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    userId: req.user.id
  });
  res.json(task);
});

// GET (only user's tasks)
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// UPDATE
router.put("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { title: req.body.title },
    { new: true }
  );
  res.json(task);
});

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
  await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });
  res.json({ message: "Deleted" });
});

export default router;