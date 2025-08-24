export const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
export const getToken = () => localStorage.getItem("token") || "";

export async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let body = opts.body;
  // If caller passed a plain object/array, serialize it once.
  if (body !== undefined && headers["Content-Type"]?.includes("application/json") && typeof body !== "string") {
    body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers, body });

  const ct = res.headers.get("content-type") || "";
  const isJSON = ct.includes("application/json");
  const payload = isJSON ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const msg = (isJSON && payload?.detail) || (typeof payload === "string" ? payload : JSON.stringify(payload));
    const err = new Error(`HTTP ${res.status}: ${msg}`);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}
