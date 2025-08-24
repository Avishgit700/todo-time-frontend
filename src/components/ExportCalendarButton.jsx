import React from "react";

export default function ExportCalendarButton() {
  async function exportICS() {
    const base = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
    const token = localStorage.getItem("token") || "";
    const res = await fetch(`${base}/todos/calendar.ics`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: "todos.ics" });
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }
  return (
    <button onClick={exportICS} className="px-3 py-2 rounded bg-slate-800 border border-slate-700">
      Export Calendar (.ics)
    </button>
  );
}
