import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

function hasToken() {
  return !!localStorage.getItem("token");
}

export default function App() {
  const [authed, setAuthed] = useState(hasToken());

  if (!authed) {
    return <AuthPage onAuth={() => setAuthed(true)} />;
  }

  return <DashboardPage onLogout={() => setAuthed(false)} />;
}
