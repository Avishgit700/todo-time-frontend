export default function Badge({ children, intent = "default" }) {
const styles = {
default: "bg-slate-800 text-slate-200",
success: "bg-emerald-700/70 text-emerald-100",
warn: "bg-amber-700/70 text-amber-100",
danger: "bg-rose-700/70 text-rose-100",
};
return (
<span className={`px-2 py-1 rounded-md text-xs ${styles[intent]}`}>{children}</span>
);
}