// frontend/src/components/Produits.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Produits({ token }) {
  const [produits, setProduits] = useState([]);

  const fetchProduits = async () => {
    const res = await axios.get('http://localhost:5000/api/produits');
    setProduits(res.data);
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const supprimerProduit = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/produits/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProduits(produits.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Catalogue Produits</h2>
      <ul>
        {produits.map(p => (
          <li key={p._id}>
            {p.nom} - {p.prix}€ - Stock: {p.stock} 
            {token && <button onClick={() => supprimerProduit(p._id)}>Supprimer</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Produits;
