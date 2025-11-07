import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import produitRoutes from "./routes/produit.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/produits", produitRoutes);
app.use("/api/auth", authRoutes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connecté"))
  .catch(err => console.error("Erreur MongoDB :", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
