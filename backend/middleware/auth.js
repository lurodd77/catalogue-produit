import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  console.log("Header Authorization reçu :", authHeader);

  if (!authHeader) return res.status(401).json({ message: "Token manquant" });

  const parts = authHeader.split(" ");
  const token = parts.length === 2 ? parts[1] : parts[0];
  if (!token) return res.status(401).json({ message: "Token manquant" });

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET non défini !");
    return res.status(500).json({ message: "Problème serveur : secret manquant" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Erreur de vérification JWT :", err.name, err.message);
      return res.status(401).json({ message: "Token invalide" });
    }

    req.user = decoded;
    console.log("Token vérifié avec succès :", decoded);
    next();
  });
};
