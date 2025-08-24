// src/lib/api.js
export const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
export const getToken = () => localStorage.getItem("token") || "";

export async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  // Only stringify if body is an object and we're sending JSON
  let body = opts.body;
  if (
    body != null &&
    (headers["Content-Type"] || "").includes("application/json") &&
    typeof body !== "string"
  ) {
    body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers, body });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `${res.status} ${res.statusText}`);
  }

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}
