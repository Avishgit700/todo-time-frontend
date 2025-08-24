// src/components/TryDemoButton.jsx
import React from "react";
import { API_BASE } from "../lib/api";

export default function TryDemoButton({ onLoggedIn }) {
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");

  async function run() {
    try {
      setBusy(true);
      setErr("");
      const res = await fetch(`${API_BASE}/auth/seed_demo`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      onLoggedIn?.();
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={run}
        disabled={busy}
        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60"
      >
        {busy ? "Seeding…" : "Try a demo"}
      </button>
      {err && <span className="text-red-400 text-sm">{err}</span>}
    </div>
  );
}
