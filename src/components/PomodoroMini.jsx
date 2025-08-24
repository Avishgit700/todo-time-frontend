import React from "react";
import { api } from "../lib/api";

export default function PomodoroMini({ todoId, minutes = 25 }) {
  const [runningId, setRunningId] = React.useState(null);
  const [left, setLeft] = React.useState(minutes * 60);

  React.useEffect(() => {
    if (!runningId) return;
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [runningId]);

  async function start() {
    const r = await api("/pomodoro/start", {
      method: "POST",
      body: JSON.stringify({ todo_id: todoId, duration_minutes: minutes }),
    });
    setRunningId(r.id);
    setLeft(minutes * 60);
  }

  async function stop() {
    if (!runningId) return;
    await api("/pomodoro/stop", {
      method: "POST",
      body: JSON.stringify({ pomodoro_id: runningId }),
    });
    setRunningId(null);
  }

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm tabular-nums">{mm}:{ss}</span>
      {!runningId ? (
        <button className="px-2 py-1 rounded bg-indigo-600 text-sm" onClick={start}>
          Start
        </button>
      ) : (
        <button className="px-2 py-1 rounded bg-amber-600 text-sm" onClick={stop}>
          Stop
        </button>
      )}
    </div>
  );
}
