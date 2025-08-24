// src/components/Header.jsx
import React from "react";
import TryDemoButton from "./TryDemoButton.jsx";

export default function Header({ authed, onLogout, loginBox }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 className="text-2xl font-bold text-indigo-400">Todo + Pomodoro</h1>
      {authed ? (
        <button
          className="px-3 py-1 rounded bg-slate-800 border border-slate-700"
          onClick={onLogout}
        >
          Logout
        </button>
      ) : (
        <div className="flex items-center gap-3 flex-wrap">
          {loginBox}
          <TryDemoButton onLoggedIn={() => window.location.reload()} />
        </div>
      )}
    </header>
  );
}
