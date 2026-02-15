import { useState } from "react";
import { apiFetch } from "../api";

export default function AuthPage({onAuth}: { onAuth: () => void }) {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function submit (){
        setErr(null);
        setLoading(true);
        try {
            if (mode === "register") {
                await apiFetch("/auth/register", {
                    method: "POST",
                    body: JSON.stringify({ email, password}),
                });
            }

            const loginRes = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password}),
                });

            localStorage.setItem("token", loginRes.token);
            onAuth();
        } catch (e: unknown) {
            if (e instanceof Error) {
                setErr(e.message);
            } else {
                setErr("An error occurred");
            }
        } finally {
            setLoading(false);
        }
    }

return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-2">JobFlow</h1>
        <p className="text-slate-400 mb-6">
          {mode === "login" ? "Login to continue" : "Create an account"}
        </p>

        <div className="space-y-3">
          <input
            className="w-full p-3 rounded-xl bg-slate-800 outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-xl bg-slate-800 outline-none"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <div className="text-red-400 text-sm">{err}</div>}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "..." : mode === "login" ? "Login" : "Register"}
          </button>

          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="w-full text-sm text-slate-400 hover:text-slate-200"
          >
            {mode === "login"
              ? "New user? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}