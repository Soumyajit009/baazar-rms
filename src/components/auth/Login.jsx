import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabase";

// Admins type a plain username (e.g. "soumyajit").
// Supabase Auth requires an email format internally, so we translate it here.
// This suffix is never shown to the user.

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Enter both username and password.");
      return;
    }

  setLoading(true);
const cleanUsername = username.trim().toLowerCase();

let { data, error: authError } = await supabase.auth.signInWithPassword({
  email: `${cleanUsername}@admin.mis`,
  password,
});

if (authError) {
  ({ data, error: authError } = await supabase.auth.signInWithPassword({
    email: `${cleanUsername}@admin.hr`,
    password,
  }));
}

setLoading(false);

if (authError) {
  setError("Incorrect username or password.");
  return;
}

onLoginSuccess(data.user);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 max-w-sm w-full">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">B</div>
          <div>
            <p className="font-semibold text-slate-900 text-sm leading-tight">Baazar RMS</p>
            <p className="text-slate-400 text-xs leading-tight">HR Portal Login</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              autoFocus
            />
          </div>
          <div>
  <label className="text-xs text-slate-500 mb-1 block">Password</label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
    />
    <button
      type="button"
      onClick={() => setShowPassword((s) => !s)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
    >
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  </div>
</div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-blue-700 shadow-sm disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}