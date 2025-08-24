import React from "react";
import { api } from "../lib/api";

export default function TodoCard({ todo, onChanged }) {
  async function toggle() {
    await api(`/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: !todo.completed }),
    });
    onChanged?.();
  }

  return (
    <li className="p-3 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
      <div>
        <div className="font-medium">{todo.title}</div>
        <div className="text-xs text-slate-400">
          {todo.tags?.map((x) => `#${x.name}`).join(" ")}
        </div>
      </div>
      <button
        onClick={toggle}
        className={`px-3 py-1 rounded ${todo.completed ? "bg-green-700" : "bg-amber-700"}`}
      >
        {todo.completed ? "Done" : "Mark done"}
      </button>
    </li>
  );
}
