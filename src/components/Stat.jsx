export default function Stat({ label, value }) {
return (
<div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow">
<div className="text-slate-400 text-sm">{label}</div>
<div className="text-2xl font-semibold mt-1">{value}</div>
</div>
);
}