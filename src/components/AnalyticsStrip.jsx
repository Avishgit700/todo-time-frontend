import React from "react";
import { api } from "../lib/api";

export default function AnalyticsStrip() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => { (async () => {
    try { setData(await api("/todos/analytics")); } catch {}
  })(); }, []);
  if (!data) return null;
  return (
    <div className="text-sm text-slate-300">
      Total: {data.total} · Completed: {data.completed} · Pending: {data.pending} · Overdue: {data.overdue} · Rate: {data.completion_rate}%
    </div>
  );
}
