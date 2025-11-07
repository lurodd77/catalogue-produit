import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Produits() {
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/produits')
      .then(res => setProduits(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Catalogue Produits</h1>
      <ul>
        {produits.map(p => (
          <li key={p._id}>{p.nom} - {p.prix}€ - Stock: {p.stock}</li>
        ))}
      </ul>
    </div>
  );
}

export default Produits;
