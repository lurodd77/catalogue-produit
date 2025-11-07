import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "Root") {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET non défini !");
      return res.status(500).json({ message: "Problème serveur : secret manquant" });
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: "Identifiants invalides" });
  }
});

export default router;
