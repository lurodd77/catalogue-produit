// frontend/src/App.js
import React, { useState } from 'react';
import Login from './components/Login';
import Produits from './components/Produits';
import AjouterProduit from './components/AjouterProduit';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleProduitAjoute = (produit) => {
    // rafraîchir la page ou mettre à jour la liste
    window.location.reload();
  };

  return (
    <div style={{ padding: 20 }}>
      {!token ? <Login setToken={setToken} /> : (
        <>
          <AjouterProduit token={token} onProduitAjoute={handleProduitAjoute} />
          <Produits token={token} />
        </>
      )}
    </div>
  );
}

export default App;
