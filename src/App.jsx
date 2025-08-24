// src/App.jsx
import React from "react";
import Header from "./components/Header.jsx";
import TodoPanel from "./components/TodoPanel.jsx";
import Landing from "./components/Landing.jsx";

export default function App() {
  const [authed, setAuthed] = React.useState(!!localStorage.getItem("token"));
  const onLoggedIn = () => setAuthed(true);
  const logout = () => { localStorage.removeItem("token"); setAuthed(false); };

  return (
    <div className="min-h-screen p-6">
      <Header authed={authed} onLogout={logout} />
      {!authed ? <Landing onLoggedIn={onLoggedIn} /> : <TodoPanel />}
    </div>
  );
}
