// src/components/TodoForm.jsx
import React from "react";
import { api, API_BASE } from "../lib/api";

export default function TodoForm({ onCreated }) {
  const [title, setTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [priority, setPriority] = React.useState(3);
  const [due, setDue] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  async function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      const dueIso = due ? new Date(due).toISOString() : null;
      const payload = {
        title: title.trim(),
        notes,
        priority: Number(priority),
        due_date: dueIso,
        tags: tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await api("/todos/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      onCreated?.();
      setTitle("");
      setNotes("");
      setPriority(3);
      setDue("");
      setTags("");
    } catch (err) {
      setError("Failed to create task.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow grid gap-3"
    >
      <h3 className="font-semibold">Add Task</h3>

      <input
        className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700"
        placeholder="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 min-h-[80px]"
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {/* Controls grid—wraps nicely on small screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <select
          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
        >
          <option value={1}>Priority: High</option>
          <option value={2}>Priority: Medium</option>
          <option value={3}>Priority: Low</option>
        </select>

        <input
          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700"
          type="datetime-local"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />

        <input
          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 lg:col-span-2"
          placeholder="tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      {/* Action row — flex-wrap prevents hidden button */}
      <div className="flex flex-wrap gap-2">
        <button
          className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Creating…" : "Create"}
        </button>

        <a
          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700"
          href={`${API_BASE}/todos/calendar.ics`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Export .ics
        </a>

        {error && <span className="text-red-400 text-sm self-center">{error}</span>}
      </div>
    </form>
  );
}
