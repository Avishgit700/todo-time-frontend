import React from "react";

export default function FilterBar({ q, setQ, view, setView, onRefresh }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        className="px-3 py-2 rounded bg-slate-800/80 border border-slate-700"
        placeholder="Search…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <select
        className="px-3 py-2 rounded bg-slate-800/80 border border-slate-700"
        value={view}
        onChange={(e) => setView(e.target.value)}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Done</option>
      </select>
      <button
        type="button"
        onClick={onRefresh}
        className="px-3 py-2 rounded bg-slate-700 border border-slate-600"
      >
        Refresh
      </button>
    </div>
  );
}
