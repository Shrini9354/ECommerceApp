import { useState } from "react";
import { register } from "../services/api";

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      await register(form);
      setMessage("Registered successfully! Please login.");
      setTimeout(() => window.location.href = "/login", 2000);
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Register</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Username</label>
        <br />
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>
      <div>
        <label>Email</label>
        <br />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>
      <div>
        <label>Password</label>
        <br />
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>
      <button
        onClick={handleSubmit}
        style={{ width: "100%", padding: "10px", background: "green", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
      >
        Register
      </button>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Register;