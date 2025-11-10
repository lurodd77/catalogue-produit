// frontend/src/components/Produits.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function Produits({ token, setToken, refreshKey = 0 }) {
  const [tasks, setTasks] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set()); // <-- ajout

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
      setSelectedIds(new Set()); // reset selection quand on recharge la liste
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  // toggle sélection d'une tâche
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const supprimerTache = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      if (err && err.response && err.response.status === 401) {
        handleUnauthorized();
        return;
      }
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  // supprime toutes les tâches sélectionnées
  const supprimerSelection = async () => {
    if (selectedIds.size === 0) return;
    if (
      !window.confirm(
        `Supprimer ${selectedIds.size} tâche(s) sélectionnée(s) ?`
      )
    )
      return;
    const ids = Array.from(selectedIds);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await Promise.all(
        ids.map((id) =>
          axios.delete(`http://localhost:5000/api/tasks/${id}`, { headers })
        )
      );
      const idsSet = new Set(ids);
      setTasks((prev) => prev.filter((t) => !idsSet.has(t._id)));
      setSelectedIds(new Set());
    } catch (err) {
      if (err && err.response && err.response.status === 401) {
        handleUnauthorized();
        return;
      }
      console.error(err);
      alert("Erreur lors de la suppression de la sélection");
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
      setTasks((prev) =>
        prev.map((task) => (task._id === t._id ? res.data : task))
      );
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

      {/* Bouton pour supprimer la sélection */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <button
          className="btn btn-danger"
          onClick={supprimerSelection}
          disabled={selectedIds.size === 0}
          title={
            selectedIds.size === 0
              ? "Aucune tâche sélectionnée"
              : `Supprimer ${selectedIds.size} tâche(s)`
          }
        >
          Supprimer la sélection ({selectedIds.size})
        </button>
      </div>

      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t._id} className="task-item">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* checkbox de sélection (pour suppression en lot) */}
              <input
                type="checkbox"
                className="select-checkbox"
                checked={selectedIds.has(t._id)}
                onChange={() => toggleSelect(t._id)}
                aria-label={`Sélectionner ${t.title}`}
              />
              <label
                className="task-main"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div className="task-meta">
                  <strong className="task-title">{t.title}</strong>
                  {t.dueDate && (
                    <span className="task-due">
                      Date: {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </label>
            </div>

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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Produits;
