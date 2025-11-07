import dotenv from "dotenv";
import path from "path";

// Forcer le chemin absolu vers le .env
dotenv.config({ path: path.resolve('./backend/.env') });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import produitRoutes from "./routes/produit.js";
import authRoutes from "./routes/auth.js";

console.log("MONGO_URI =", process.env.MONGO_URI); // debug

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/produits", produitRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connecté ✅"))
  .catch(err => console.error("Erreur MongoDB ❌ :", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
