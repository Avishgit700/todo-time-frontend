// src/lib/api.js

// ---- Base URL ---------------------------------------------------------------
// In prod (Vercel), set VITE_API_BASE to your Render URL:
//   VITE_API_BASE=https://fastapi-backend-0gev.onrender.com
// In dev it falls back to localhost.
export const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE) ||
  "http://127.0.0.1:8000";

// ---- Auth token helpers -----------------------------------------------------
const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t || "");
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// ---- Internal: filter normalization ----------------------------------------
// UI may use "active"/"completed"; API expects "pending"/"done".
const FILTER_MAP = { active: "pending", completed: "done" };
const VALID_FILTERS = new Set(["all", "pending", "done", "urgent"]);

function normalizeTodosPath(path) {
  // Only touch /todos/ list endpoint with ?filter=...
  try {
    // Build a URL so we can safely read/modify query params.
    const u = new URL(path, "http://placeholder");
    if (!u.pathname.replace(/\/+$/, "").endsWith("/todos")) return path;

    const f = u.searchParams.get("filter");
    if (!f) return path;

    const mapped = FILTER_MAP[f] || f;
    const final = VALID_FILTERS.has(mapped) ? mapped : "all";
    u.searchParams.set("filter", final);
    return u.pathname + (u.search ? u.search : "");
  } catch {
    // If path isn't a valid URL fragment, leave as-is
    return path;
  }
}

// ---- Core fetch wrapper -----------------------------------------------------
export async function api(path, opts = {}) {
  // Normalize todos filter if present
  const normalizedPath =
    path.startsWith("/todos/") || path === "/todos" || path === "/todos/"
      ? normalizeTodosPath(path)
      : path;

  const url =
    normalizedPath.startsWith("http")
      ? normalizedPath
      : `${API_BASE}${normalizedPath.startsWith("/") ? "" : "/"}${normalizedPath}`;

  // Headers
  const headers = new Headers(opts.headers || {});
  const token = getToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Auto JSON encode if `json` provided
  let body = opts.body;
  if (opts.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(opts.json);
  } else if (
    body &&
    typeof body === "object" &&
    !(body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const res = await fetch(url, { method: "GET", ...opts, headers, body });

  // Try to parse error bodies nicely
  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    const isJSON = ct.includes("application/json");
    const errPayload = isJSON ? await res.json().catch(() => ({})) : await res.text().catch(() => "");
    const err = new Error(isJSON ? JSON.stringify(errPayload) : String(errPayload || res.statusText));
    err.status = res.status;
    err.payload = errPayload;
    // Optional: if unauthorized, clear token so UI can prompt login
    if (res.status === 401) clearToken();
    throw err;
  }

  // Parse success
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

// ---- Auth endpoints ---------------------------------------------------------
export async function register(email, password) {
  return api("/auth/register", { method: "POST", json: { email, password } });
}

export async function login(email, password) {
  // Backend expects form-encoded for /auth/login
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);
  const data = await api("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (data?.access_token) setToken(data.access_token);
  return data;
}

export async function me() {
  return api("/auth/me");
}

export async function seedDemo() {
  return api("/auth/seed_demo", { method: "POST" });
}

// ---- Todos endpoints --------------------------------------------------------
export function listTodos(uiFilter = "all") {
  // You can pass "all" | "active" | "completed" | "urgent"
  // This will be normalized internally for the API.
  const search = new URLSearchParams();
  if (uiFilter) search.set("filter", uiFilter);
  return api(`/todos/?${search.toString()}`);
}

export function createTodo({ title, notes = "", priority = 2, estimate_minutes = 25, due_date = null, plan_at = null, tags = [] }) {
  return api("/todos/", {
    method: "POST",
    json: { title, notes, priority, estimate_minutes, due_date, plan_at, tags },
  });
}

export function updateTodo(id, patch) {
  return api(`/todos/${id}`, { method: "PUT", json: patch });
}

export function deleteTodo(id) {
  return api(`/todos/${id}`, { method: "DELETE" });
}

export function addStep(todoId, { text, order = 0 }) {
  return api(`/todos/${todoId}/steps`, { method: "POST", json: { text, order } });
}

export function updateStep(stepId, patch) {
  return api(`/todos/steps/${stepId}`, { method: "PUT", json: patch });
}

export function deleteStep(stepId) {
  return api(`/todos/steps/${stepId}`, { method: "DELETE" });
}

// ---- Pomodoro endpoints -----------------------------------------------------
export function startPomodoro({ todo_id = null, duration_minutes = 25, note = "" } = {}) {
  return api("/pomodoro/start", { method: "POST", json: { todo_id, duration_minutes, note } });
}

export function stopPomodoro(pomodoro_id) {
  return api("/pomodoro/stop", { method: "POST", json: { pomodoro_id } });
}

export function summaryPomodoro(days = 7) {
  const qs = new URLSearchParams({ days: String(days) });
  return api(`/pomodoro/summary?${qs.toString()}`);
}
