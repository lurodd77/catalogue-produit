import express from "express";
import Task from "../models/Produit.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dueDate: 1, title: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks (protégé)
router.post("/", verifyToken, async (req, res) => {
  const { title, description, dueDate } = req.body;
  const task = new Task({ title, description, dueDate });
  try {
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/tasks/:id (protégé) => update fields (toggle completed, edit ...)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Tâche introuvable" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id (protégé)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Tâche introuvable" });
    res.json({ message: "Tâche supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
