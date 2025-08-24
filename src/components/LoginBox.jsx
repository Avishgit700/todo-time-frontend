// src/components/LoginBox.jsx
import React from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export default function LoginBox({ onLoggedIn }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function register(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const txt = await res.text();
        // backend often returns {"detail": "..."} for errors
        try {
          const j = JSON.parse(txt);
          setError(j.detail || txt);
        } catch {
          setError(txt || "Registration failed");
        }
        return;
      }
      alert("Registered! Now login.");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function login(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = new URLSearchParams({ username: email, password });
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!res.ok) {
        const txt = await res.text();
        try {
          const j = JSON.parse(txt);
          setError(j.detail || txt);
        } catch {
          setError(txt || "Invalid email or password");
        }
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      onLoggedIn?.();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-2 w-full max-w-md"
      onSubmit={login}
      noValidate
    >
      <input
        className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
      />
      <input
        className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
      />

      {/* Error lives under inputs, inside the form */}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-2">
        <button
          className="px-3 py-2 rounded bg-indigo-600 disabled:opacity-50 flex-1"
          type="submit"
          disabled={loading}
        >
          {loading ? "…" : "Login"}
        </button>
        <button
          type="button"
          onClick={register}
          className="px-3 py-2 rounded bg-slate-800 border border-slate-700 disabled:opacity-50 flex-1"
          disabled={loading}
        >
          Register
        </button>
      </div>
    </form>
  );
}
