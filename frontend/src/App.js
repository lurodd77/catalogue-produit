// frontend/src/App.js
import React, { useState } from "react";
import "./App.css"; // <-- ajouté
import Login from "./components/Login";
import Produits from "./components/Produits";
import AjouterProduit from "./components/AjouterProduit";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProduitAjoute = (produit) => {
    // incrémente la clé pour demander au composant Produits de recharger la liste
    setRefreshKey((k) => k + 1);
  };

  return (
    <div style={{ padding: 20 }}>
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <AjouterProduit
            token={token}
            setToken={setToken}
            onProduitAjoute={handleProduitAjoute}
          />
          <Produits token={token} setToken={setToken} refreshKey={refreshKey} />
        </>
      )}
    </div>
  );
}

export default App;
