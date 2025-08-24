// src/components/StepsList.jsx
import React from "react";
import { api } from "../lib/api";

export default function StepsList({ todo, onChanged }) {
  const [newText, setNewText] = React.useState("");

  async function addStep(e) {
    e.preventDefault();
    const text = newText.trim();
    if (!text) return;
    await api(`/todos/${todo.id}/steps`, {
      method: "POST",
      body: JSON.stringify({ text, order: (todo.steps?.length || 0) }),
    });
    setNewText("");
    onChanged?.();
  }

  async function toggleDone(step) {
    await api(`/todos/steps/${step.id}`, {
      method: "PUT",
      body: JSON.stringify({ done: !step.done }),
    });
    onChanged?.();
  }

  async function renameStep(step, text) {
    const t = text.trim();
    if (!t || t === step.text) return;
    await api(`/todos/steps/${step.id}`, {
      method: "PUT",
      body: JSON.stringify({ text: t }),
    });
    onChanged?.();
  }

  async function deleteStep(step) {
    if (!confirm("Delete this step?")) return;
    await api(`/todos/steps/${step.id}`, { method: "DELETE" });
    onChanged?.();
  }

  return (
    <div className="mt-3 space-y-2">
      <form onSubmit={addStep} className="flex gap-2">
        <input
          className="flex-1 px-2 py-1 rounded bg-slate-800 border border-slate-700"
          placeholder="Add a step…"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <button className="px-3 py-1 rounded bg-slate-700 border border-slate-600">
          + Step
        </button>
      </form>

      <ul className="space-y-1">
        {(todo.steps || [])
          .slice()
          .sort((a, b) => a.order - b.order || a.id - b.id)
          .map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-2 px-2 py-1 rounded bg-slate-900 border border-slate-800"
            >
              <input
                type="checkbox"
                checked={!!s.done}
                onChange={() => toggleDone(s)}
              />
              <EditableText
                initial={s.text}
                onSave={(txt) => renameStep(s, txt)}
                className={`flex-1 ${s.done ? "line-through text-slate-500" : ""}`}
              />
              <button
                onClick={() => deleteStep(s)}
                className="text-xs text-red-300 hover:text-red-200"
                title="Delete"
              >
                ✕
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

function EditableText({ initial, onSave, className = "" }) {
  const [editing, setEditing] = React.useState(false);
  const [val, setVal] = React.useState(initial);

  React.useEffect(() => setVal(initial), [initial]);

  function submit() {
    setEditing(false);
    if (val.trim() !== initial.trim()) onSave?.(val);
  }

  if (!editing) {
    return (
      <span
        className={`${className} cursor-text`}
        onClick={() => setEditing(true)}
        title="Click to edit"
      >
        {initial}
      </span>
    );
  }
  return (
    <input
      className={`flex-1 px-1 py-0.5 rounded bg-slate-800 border border-slate-700 ${className}`}
      value={val}
      autoFocus
      onChange={(e) => setVal(e.target.value)}
      onBlur={submit}
      onKeyDown={(e) => {
        if (e.key === "Enter") submit();
        if (e.key === "Escape") {
          setVal(initial);
          setEditing(false);
        }
      }}
    />
  );
}
