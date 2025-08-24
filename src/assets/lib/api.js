export const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";


export async function api(path, opts = {}) {
const res = await fetch(`${API_BASE}${path}`, {
headers: { "Content-Type": "application/json" },
...opts,
});
if (!res.ok) throw new Error(await res.text());
const isJson = res.headers.get("content-type")?.includes("application/json");
return isJson ? res.json() : res.text();
}


export function useAsync(fn, deps = []) {
const [data, setData] = React.useState(null);
const [loading, setLoading] = React.useState(false);
const [error, setError] = React.useState(null);
React.useEffect(() => {
let alive = true;
setLoading(true);
setError(null);
fn()
.then((d) => alive && setData(d))
.catch((e) => alive && setError(e))
.finally(() => alive && setLoading(false));
return () => { alive = false };
}, deps); // eslint-disable-line
return { data, loading, error, refresh: () => fn().then(setData) };
}