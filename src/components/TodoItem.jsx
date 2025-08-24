import React from "react";
import PomodoroMini from "./PomodoroMini.jsx";

export default function TodoItem({ t, onToggle, onDelete }) {
  return (
    <li className="p-3 rounded bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={t.completed} onChange={() => onToggle(t)} />
        <div>
          <div className={`font-medium ${t.completed ? "line-through text-slate-500" : ""}`}>
            {t.title}
          </div>
          <div className="text-xs text-slate-400">
            {t.tags.map((x) => `#${x.name}`).join(" ")}
            {t.due_date && <span className="ml-2">• due {new Date(t.due_date).toLocaleString()}</span>}
            <span className="ml-2">• {t.priority === 1 ? "High" : t.priority === 2 ? "Medium" : "Low"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <PomodoroMini todoId={t.id} />
        <button onClick={() => onDelete(t)} className="px-2 py-1 rounded bg-rose-600 text-sm">Delete</button>
      </div>
    </li>
  );
}
