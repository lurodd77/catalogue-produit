// frontend/src/components/AjouterProduit.js
import React, { useState } from 'react';
import axios from 'axios';

function AjouterProduit({ token, onProduitAjoute }) {
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [stock, setStock] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/produits', {
        nom, prix, stock
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onProduitAjoute(res.data);
      setNom(''); setPrix(''); setStock('');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'ajout du produit');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>Ajouter un produit</h3>
      <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required />
      <input type="number" placeholder="Prix" value={prix} onChange={e => setPrix(e.target.value)} required />
      <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} required />
      <button type="submit">Ajouter</button>
    </form>
  );
}

export default AjouterProduit;
