// src/lib/api.js

// --- Base URL ---------------------------------------------------------------
// Local dev:    VITE_API_BASE not set  -> http://127.0.0.1:8000
// Production:   set VITE_API_BASE in Vercel to your Render URL
//               (fallback below also switches based on build mode)
const PROD_API = "https://fastapi-backend-0gev.onrender.com";

export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.MODE === "production" ? PROD_API : "http://127.0.0.1:8000");

// --- Auth token helpers -----------------------------------------------------
export const getToken = () => localStorage.getItem("token") || "";
export const setToken = (t) => localStorage.setItem("token", t || "");
export const clearToken = () => localStorage.removeItem("token");

// --- Core fetch helpers -----------------------------------------------------
// Generic JSON API call (default). Automatically stringifies plain objects.
export async function api(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };

  // Add auth header if we have a token
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  // If body is a plain object and not already a string/FormData/URLSearchParams,
  // send JSON with the proper header.
  let body = opts.body;
  const isPlainObj =
    body &&
    typeof body === "object" &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob);

  if (isPlainObj) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers, body });

  // Handle non-2xx gracefully with best-effort error message
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const j = await res.json();
        message = typeof j === "string" ? j : JSON.stringify(j);
      } else {
        message = await res.text();
      }
    } catch {
      /* ignore parse errors */
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  // 204 No Content (e.g., deletes)
  if (res.status === 204) return null;

  // Parse by content type
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

// Form-encoded POST (use for /auth/login which expects OAuth2PasswordRequestForm)
export async function apiForm(path, data = {}, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const body = new URLSearchParams();
  Object.entries(data).forEach(([k, v]) => body.append(k, v ?? ""));

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    ...opts,
    headers, // do NOT set Content-Type manually; fetch sets it for URLSearchParams
    body,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const ct = res.headers.get("content-type") || "";
      message = ct.includes("application/json") ? JSON.stringify(await res.json()) : await res.text();
    } catch { /* ignore */ }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

// --- Convenience methods ----------------------------------------------------
// Log in, store token, return it.
export async function login(email, password) {
  const { access_token } = await apiForm("/auth/login", {
    username: email,
    password,
    // grant_type/scope/client_id/client_secret are optional for our backend
  });
  setToken(access_token);
  return access_token;
}

export function logout() {
  clearToken();
}
