// frontend/src/components/AjouterProduit.js
import React, { useState } from "react";
import axios from "axios";

function AjouterProduit({ token, setToken, onProduitAjoute }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // même liste que dans Produits (garder cohérence)
  const familyMembers = ["Alice", "Bob", "Maman", "Papa", "Tante"];

  const handleUnauthorized = () => {
    // token expiré -> déconnexion
    localStorage.removeItem("token");
    if (typeof setToken === "function") setToken("");
    alert("Session expirée. Veuillez vous reconnecter.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        description,
        dueDate: dueDate || null,
        assignedTo: assignedTo || null,
      };
      const res = await axios.post("http://localhost:5000/api/tasks", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onProduitAjoute && onProduitAjoute(res.data);
      setTitle("");
      setDescription("");
      setDueDate("");
      setAssignedTo("");
    } catch (err) {
      // si 401 -> token expiré ou invalide
      if (err && err.response && err.response.status === 401) {
        handleUnauthorized();
        return;
      }
      console.error(err);
      alert("Erreur lors de l'ajout de la tâche");
    }
  };

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
      style={{ marginBottom: 20 }}
    >
      <h3 className="form-title">Ajouter une tâche</h3>
      <input
        className="input"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="input"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="input"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <select
        className="input"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      >
        <option value="">— Assigné à —</option>
        {familyMembers.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <button className="btn" type="submit">
        Ajouter
      </button>
    </form>
  );
}

export default AjouterProduit;
