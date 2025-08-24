// src/components/Landing.jsx
import React from "react";
import LoginBox from "./LoginBox.jsx";

export default function Landing({ onLoggedIn }) {
  return (
    <main className="relative">
      {/* soft radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_circle_at_20%_0%,rgba(99,102,241,.25),transparent_60%),radial-gradient(700px_circle_at_80%_20%,rgba(16,185,129,.15),transparent_60%)]" />

      {/* hero */}
      <section className="relative mx-auto max-w-5xl pt-10 pb-12 md:pt-16 md:pb-16 text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Focus faster with <span className="text-indigo-400">Todos</span> + <span className="text-emerald-400">Pomodoro</span>
        </h1>
        <p className="mx-auto max-w-2xl text-slate-300">
          A minimal, fast productivity app: quick tasks, one-click Pomodoros, and calendar export. Built with FastAPI + React.
        </p>

        {/* login/register inline */}
        <div className="mx-auto w-full max-w-xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
            <LoginBox onLoggedIn={onLoggedIn} />
          </div>
          <p className="mt-2 text-xs text-slate-400">No spam. Just an email + password to get started.</p>
        </div>

        {/* preview card */}
<div className="mx-auto mt-8 max-w-4xl">
  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-left overflow-hidden relative">
    <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]">
      <div className="animate-[shimmer_2.8s_linear_infinite] absolute -inset-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-6" />
    </div>

    <div className="flex items-center gap-2 mb-3">
      <span className="h-2 w-2 rounded-full bg-red-500/70" />
      <span className="h-2 w-2 rounded-full bg-amber-500/70" />
      <span className="h-2 w-2 rounded-full bg-green-500/70" />
      <span className="ml-2 text-sm text-slate-400">Preview</span>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      {/* Add Task mock */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="text-sm text-slate-400 mb-2">Add Task</div>
        <div className="h-8 rounded bg-slate-800 animate-pulse mb-2" />
        <div className="h-8 rounded bg-slate-800 animate-pulse mb-2" />
        <div className="h-9 w-24 rounded bg-indigo-600/70" />
      </div>
      {/* Pomodoro mock */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="text-sm text-slate-400 mb-2">Pomodoro</div>
        <div className="h-24 rounded bg-slate-800 animate-pulse mb-3" />
        <div className="flex gap-2">
          <div className="h-9 w-24 rounded bg-indigo-600/70" />
          <div className="h-9 w-24 rounded bg-slate-800" />
        </div>
      </div>
      {/* Analytics mock */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="text-sm text-slate-400 mb-2">Analytics</div>
        <div className="h-2 w-1/2 rounded bg-slate-800 animate-pulse mb-2" />
        <div className="h-2 w-1/3 rounded bg-slate-800 animate-pulse mb-2" />
        <div className="h-28 rounded bg-slate-800 animate-pulse" />
      </div>
    </div>
  </div>
</div>

      </section>

      {/* features */}
      <section className="relative mx-auto max-w-5xl pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Quick add", text: "Add tasks with priority, due date and tags in one shot." },
            { title: "Pomodoro built-in", text: "Start/stop a focus timer right from any task." },
            { title: "Calendar export", text: "One click .ics feed to view tasks in your calendar." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="text-lg font-semibold mb-1">{f.title}</div>
              <div className="text-slate-300 text-sm">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="relative mx-auto max-w-5xl pb-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} • Built with FastAPI, React, Tailwind
      </footer>
    </main>
  );
}
