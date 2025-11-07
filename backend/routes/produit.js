import express from "express";
import Produit from "../models/Produit.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/produits
router.get("/", async (req, res) => {
  try {
    const produits = await Produit.find();
    res.json(produits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/produits (protégé)
router.post("/", verifyToken, async (req, res) => {
  const { nom, prix, stock } = req.body;
  const produit = new Produit({ nom, prix, stock });
  try {
    const savedProduit = await produit.save();
    res.status(201).json(savedProduit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/produits/:id (protégé)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const produit = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(produit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/produits/:id (protégé)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Produit.findByIdAndDelete(req.params.id);
    res.json({ message: "Produit supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
