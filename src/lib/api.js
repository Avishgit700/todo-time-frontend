// src/lib/api.js
export const API_BASE =
  import.meta.env.VITE_API_BASE || "https://fastapi-backend-0gev.onrender.com";

export const getToken = () => localStorage.getItem("token") || "";

// Map UI filter names -> API filter names
const FILTER_MAP = {
  all: "all",
  active: "pending",     // UI "active" => API "pending"
  completed: "done",     // UI "completed" => API "done"
  urgent: "urgent",
};

export async function api(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };

  // Only set JSON header if body is not FormData and user didn't set it
  const isFormData = opts.body instanceof FormData;
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let body = opts.body;
  if (body && !isFormData && typeof body !== "string") {
    body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers, body });
  if (!res.ok) {
    let text = await res.text();
    try { text = JSON.stringify(JSON.parse(text)); } catch {}
    throw new Error(text);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

// Always call this to list todos so the mapping is applied
export function listTodos(uiFilter = "all") {
  const f = FILTER_MAP[uiFilter] ?? "all";
  return api(`/todos/?filter=${encodeURIComponent(f)}`);
}
