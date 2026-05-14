import { useState } from "react";
import { login } from "../services/api";

function Login() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      window.location.href = "/products";
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Login</h2>
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
        style={{ width: "100%", padding: "10px", background: "blue", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
      >
        Login
      </button>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
}

export default Login;