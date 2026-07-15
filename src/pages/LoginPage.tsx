import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useApp } from "../contexts/AppContext";

export function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login } = useApp();
  const hostMode = params.get("mode") === "host";

  const [mode, setMode] = useState<"login" | "signup">(hostMode ? "signup" : "login");
  const [isHost, setIsHost] = useState(hostMode);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function f(k: keyof typeof form, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.password) return;
    if (mode === "signup" && !form.name) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const name = mode === "signup" ? form.name : form.email.split("@")[0];
    login(form.email, name, isHost);
    setLoading(false);
    if (isHost) navigate("/host");
    else navigate("/profile");
  }

  function handleSocial(provider: string) {
    const name = `${provider} User`;
    login(`${provider.toLowerCase()}@example.com`, name, isHost);
    if (isHost) navigate("/host");
    else navigate("/profile");
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center pt-16 px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-fuchsia-200/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-100/20 blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-200">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-black text-[#0D0D1A] text-xl" style={{ fontFamily: "var(--font-display)" }}>CraftVerse</span>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/70 shadow-2xl shadow-black/5 p-8">
          {/* Tab toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            {(["login", "signup"] as const).map((m) => (
              <motion.button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${mode === m ? "bg-white text-[#0D0D1A] shadow-sm" : "text-gray-500"}`}>
                {m === "login" ? "Sign In" : "Create Account"}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-2xl font-black text-[#0D0D1A] mb-1" style={{ fontFamily: "var(--font-display)" }}>
                {mode === "login" ? "Welcome back" : "Join CraftVerse"}
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                {mode === "login" ? "Sign in to access your bookings and saved workshops." : "Start discovering and booking creative workshops today."}
              </p>

              {/* Social logins */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[["🍎", "Apple"], ["🇬", "Google"]].map(([icon, name]) => (
                  <motion.button key={name} onClick={() => handleSocial(name)}
                    whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:border-violet-300 hover:bg-violet-50/50 transition-all">
                    <span>{icon}</span> {name}
                  </motion.button>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or continue with email</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={form.name} onChange={(e) => f("name", e.target.value)}
                      placeholder="Full name" required
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl text-sm text-[#0D0D1A] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all" />
                  </div>
                )}
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={form.email} onChange={(e) => f("email", e.target.value)}
                    placeholder="Email address" required
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl text-sm text-[#0D0D1A] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all" />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => f("password", e.target.value)}
                    placeholder="Password" required
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-2xl text-sm text-[#0D0D1A] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Host toggle */}
                <label className="flex items-center gap-3 cursor-pointer py-2">
                  <div className={`w-11 h-6 rounded-full transition-all relative ${isHost ? "bg-[#7C3AED]" : "bg-gray-200"}`}
                    onClick={() => setIsHost(!isHost)}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${isHost ? "left-5" : "left-0.5"}`} />
                  </div>
                  <span className="text-sm font-medium text-[#0D0D1A]">I want to host workshops</span>
                </label>

                {mode === "login" && (
                  <div className="text-right">
                    <button type="button" className="text-xs text-[#7C3AED] hover:underline">Forgot password?</button>
                  </div>
                )}

                <motion.button type="submit" disabled={loading}
                  whileHover={!loading ? { scale: 1.02, boxShadow: "0 12px 40px rgba(124,58,237,0.4)" } : {}}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#7C3AED] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-violet-200 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <>{mode === "login" ? "Sign In" : "Create Account"} <ArrowRight size={16} /></>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>

          <p className="text-center text-xs text-gray-400 mt-6">
            By continuing, you agree to our{" "}
            <button className="text-[#7C3AED] hover:underline">Terms of Service</button>{" "}
            and{" "}
            <button className="text-[#7C3AED] hover:underline">Privacy Policy</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
