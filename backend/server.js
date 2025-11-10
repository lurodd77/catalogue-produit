import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import produitsRoutes from "./routes/produit.js";

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas connecté ✅"))
  .catch((err) => console.error("Erreur MongoDB :", err));

// Routes
app.use("/api/auth", authRoutes);
// mounted as "tasks" (route file kept as produit.js but now implements tasks)
app.use("/api/tasks", produitsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
