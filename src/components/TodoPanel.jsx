import React from "react";
import { api } from "../lib/api";

function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-800 border-slate-700 text-slate-200",
    green: "bg-green-900/30 border-green-800 text-green-300",
    red: "bg-red-900/30 border-red-800 text-red-300",
    amber: "bg-amber-900/30 border-amber-800 text-amber-300",
    indigo: "bg-indigo-900/30 border-indigo-800 text-indigo-300",
  };
  return (
    <span className={`px-2 py-0.5 rounded border text-xs ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
}

function PomodoroMini({ todo }) {
  const [running, setRunning] = React.useState(false);

  async function start() {
    await api("/pomodoro/start", {
      method: "POST",
      body: JSON.stringify({
        todo_id: todo.id,
        duration_minutes: Number(todo.estimate_minutes || 25),
      }),
    });
    setRunning(true);
  }

  async function stop() {
    // NOTE: backend stops the latest open one for this user
    await api("/pomodoro/stop", { method: "POST", body: JSON.stringify({ pomodoro_id: 1 }) });
    setRunning(false);
  }

  return (
    <div className="flex items-center gap-2">
      {!running ? (
        <button className="px-2 py-1 rounded bg-indigo-600" onClick={start}>Start</button>
      ) : (
        <button className="px-2 py-1 rounded bg-red-600" onClick={stop}>Stop</button>
      )}
    </div>
  );
}

export default function TodoPanel() {
  const [todos, setTodos] = React.useState([]);
  const [q, setQ] = React.useState("");
  const [view, setView] = React.useState("all"); // all | active | completed
  const [tag, setTag] = React.useState("");
  const [prio, setPrio] = React.useState("");

  const [title, setTitle] = React.useState("");
  const [priority, setPriority] = React.useState(2);
  const [dueDate, setDueDate] = React.useState("");
  const [estimate, setEstimate] = React.useState(25);
  const [tags, setTags] = React.useState("");
  const [error, setError] = React.useState("");

  async function load() {
    const params = new URLSearchParams();
    if (view) params.set("filter", view);
    if (q) params.set("q", q);
    if (tag) params.set("tag", tag);
    if (prio) params.set("priority", prio);
    const data = await api(`/todos/?${params.toString()}`);
    setTodos(data);
  }

  React.useEffect(() => { load(); }, []);
  React.useEffect(() => { load(); }, [view]);

  async function add(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setError("");
    try {
      await api("/todos/", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          priority: Number(priority),
          estimate_minutes: Number(estimate) || 25,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
          tags: tags.split(",").map(s => s.trim()).filter(Boolean),
        }),
      });
      setTitle(""); setTags(""); setDueDate(""); setEstimate(25); setPriority(2);
      await load();
    } catch (e) {
      console.error(e);
      setError("Failed to add todo");
    }
  }

  async function toggleComplete(todo) {
    await api(`/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: !todo.completed }),
    });
    await load();
  }

  async function remove(todo) {
    if (!confirm("Delete this todo?")) return;
    await api(`/todos/${todo.id}`, { method: "DELETE" });
    await load();
  }

  const total = todos.length;
  const done = todos.filter(t => t.completed).length;
  const pending = total - done;
  const overdue = todos.filter(t => !t.completed && t.due_date && new Date(t.due_date) < new Date()).length;
  const rate = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-5">
{/* Filters & Actions */}
<div className="flex flex-wrap items-center justify-between gap-3">
  <div className="w-full overflow-x-auto">
    <div className="flex items-center gap-2 min-w-max">
      {["all", "active", "completed"].map(v => (
        <button
          key={v}
          onClick={() => setView(v)}
          className={`px-3 py-1 rounded border ${
            view === v ? "bg-indigo-600 border-indigo-500" : "bg-slate-900 border-slate-700"
          }`}
        >
          {v}
        </button>
      ))}
      <input
        className="px-2 py-1 rounded bg-slate-900 border border-slate-700"
        placeholder="Search…"
        value={q}
        onChange={e => setQ(e.target.value)}
        onKeyDown={e => e.key === "Enter" && load()}
      />
      <input
        className="px-2 py-1 rounded bg-slate-900 border border-slate-700"
        placeholder="#tag"
        value={tag}
        onChange={e => setTag(e.target.value)}
        onKeyDown={e => e.key === "Enter" && load()}
      />
      <select
        className="px-2 py-1 rounded bg-slate-900 border border-slate-700"
        value={prio}
        onChange={e => setPrio(e.target.value)}
      >
        <option value="">Priority</option>
        <option value="1">High</option>
        <option value="2">Medium</option>
        <option value="3">Low</option>
      </select>
      <button
        className="px-3 py-1 rounded bg-slate-800 border border-slate-700"
        onClick={load}
      >
        Apply
      </button>
    </div>
  </div>

  <a
    className="px-3 py-1 rounded bg-slate-800 border border-slate-700"
    href={`${import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000"}/todos/calendar.ics`}
    target="_blank"
    rel="noopener noreferrer"
  >
    Export calendar
  </a>
</div>


      {/* Add form */}
      <form onSubmit={add} className="grid md:grid-cols-5 gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <input
          className="px-3 py-2 rounded bg-slate-900 border border-slate-700 md:col-span-2"
          placeholder="New task title…"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <select
          className="px-3 py-2 rounded bg-slate-900 border border-slate-700"
          value={priority}
          onChange={e => setPriority(Number(e.target.value))}
        >
          <option value={1}>High</option>
          <option value={2}>Medium</option>
          <option value={3}>Low</option>
        </select>
        <input
          type="datetime-local"
          className="px-3 py-2 rounded bg-slate-900 border border-slate-700"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
        <input
          type="number"
          min={5}
          className="px-3 py-2 rounded bg-slate-900 border border-slate-700"
          value={estimate}
          onChange={e => setEstimate(Number(e.target.value))}
          placeholder="mins"
        />
        <input
          className="px-3 py-2 rounded bg-slate-900 border border-slate-700 md:col-span-3"
          placeholder="tags: comma,separated"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        <button
          className="px-3 py-2 rounded bg-indigo-600 md:col-span-2 disabled:opacity-60"
          disabled={!title.trim()}
        >
          Add
        </button>
        {error && <div className="md:col-span-5 text-sm text-red-400">{error}</div>}
      </form>

      {/* Stats strip */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge tone="indigo">Total: {total}</Badge>
        <Badge tone="green">Completed: {done}</Badge>
        <Badge tone="amber">Pending: {pending}</Badge>
        <Badge tone="red">Overdue: {overdue}</Badge>
        <Badge tone="slate">Rate: {rate}%</Badge>
      </div>

      {/* List */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <div className="text-slate-400">No todos yet.</div>
        ) : (
          todos.map(t => (
            <div
              key={t.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-start justify-between gap-3"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <input type="checkbox" checked={!!t.completed} onChange={() => toggleComplete(t)} />
                  <div className={`font-medium ${t.completed ? "line-through text-slate-500" : ""}`}>
                    {t.title}
                  </div>
                  <Badge tone={t.priority === 1 ? "red" : t.priority === 2 ? "amber" : "slate"}>
                    {t.priority === 1 ? "High" : t.priority === 2 ? "Medium" : "Low"}
                  </Badge>
                  {t.tags?.map(x => <Badge key={x.id}>#{x.name}</Badge>)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {t.due_date
                    ? <>Due: {new Date(t.due_date).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}</>
                    : "No due date"}
                  {" · "}Est: {t.estimate_minutes || 25}m
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PomodoroMini todo={t} />
                <button className="px-2 py-1 rounded bg-slate-800 border border-slate-700" onClick={() => remove(t)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
