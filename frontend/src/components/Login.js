// frontend/src/components/Login.js
import React, { useState } from "react";
import axios from "axios";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token); // garde le token
    } catch (err) {
      alert("Login échoué");
      console.error(err);
    }
  };

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
      style={{ marginBottom: 20 }}
    >
      <h2 className="form-title">Connexion</h2>
      <input
        className="input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        className="input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="btn" type="submit">
        Login
      </button>
    </form>
  );
}

export default Login;
