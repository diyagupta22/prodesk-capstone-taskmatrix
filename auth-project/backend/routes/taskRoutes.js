import express from "express";
import Task from "../models/Task.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Task title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
      userId: req.user.id
    });
    res.json(task);
  } catch (error) {
    console.error("Create task error:", error.message);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// GET (only user's tasks)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error.message);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// UPDATE
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Task title is required" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title: title.trim() },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Update task error:", error.message);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete task error:", error.message);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;