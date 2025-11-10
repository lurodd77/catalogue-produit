// frontend/src/components/Produits.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function Produits({ token, setToken, refreshKey = 0 }) {
  const [tasks, setTasks] = useState([]);

  // liste simple de membres de la "famille" (adapter si tu veux externaliser)
  const familyMembers = ["Alice", "Bob", "Maman", "Papa", "Tante"];

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    if (typeof setToken === "function") setToken("");
    alert("Session expirée. Veuillez vous reconnecter.");
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const supprimerTache = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      if (err && err.response && err.response.status === 401) {
        handleUnauthorized();
        return;
      }
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  const toggleComplete = async (t) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${t._id}`,
        {
          completed: !t.completed,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setTasks(tasks.map((task) => (task._id === t._id ? res.data : task)));
    } catch (err) {
      if (err && err.response && err.response.status === 401) {
        handleUnauthorized();
        return;
      }
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  // nouvelle fonction pour mettre à jour la personne assignée
  const updateAssignedTo = async (task, newPerson) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        { assignedTo: newPerson },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setTasks(tasks.map((tt) => (tt._id === task._id ? res.data : tt)));
    } catch (err) {
      if (err && err.response && err.response.status === 401) {
        handleUnauthorized();
        return;
      }
      console.error(err);
      alert("Erreur lors de la mise à jour de l'assignation");
    }
  };

  return (
    <div className="app-container">
      <h2 className="app-title">Gestion des tâches</h2>
      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t._id} className="task-item">
            <label className="task-main">
              <input
                className="task-checkbox"
                type="checkbox"
                checked={!!t.completed}
                onChange={() => toggleComplete(t)}
              />
              <div className="task-meta">
                <strong className="task-title">{t.title}</strong>
                {t.dueDate && (
                  <span className="task-due">
                    Date: {new Date(t.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </label>

            {t.description && <div className="task-desc">{t.description}</div>}

            {/* colonne assignation : select pour choisir la personne */}
            <div
              style={{
                marginTop: 8,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <label style={{ fontSize: 12, color: "#475569" }}>
                Assigné à
              </label>
              <select
                className="input"
                value={t.assignedTo || ""}
                onChange={(e) => updateAssignedTo(t, e.target.value)}
              >
                <option value="">— personne —</option>
                {familyMembers.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {token && (
              <button
                className="btn btn-danger"
                onClick={() => supprimerTache(t._id)}
                style={{ marginTop: 8 }}
              >
                Supprimer
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Produits;
