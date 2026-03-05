import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import DB from "../data/db";

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const switchMode = (m) => { setMode(m); setError(""); setSuccess(""); };

  const submit = async () => {
    setError(""); setSuccess("");
    if (!form.email || !form.password) return setError("All fields are required.");
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    if (mode === "register") {
      if (!form.name.trim()) { setLoading(false); return setError("Full name is required."); }
      if (form.password.length < 6) { setLoading(false); return setError("Password must be at least 6 characters."); }
      if (DB.userExists(form.email)) { setLoading(false); return setError("Email already registered."); }
      DB.insertUser(form.name.trim(), form.email.trim(), form.password);
      setSuccess("Account created! Sign in now.");
      switchMode("login");
    } else {
      const u = DB.loginUser(form.email.trim(), form.password);
      if (!u) { setLoading(false); return setError("Invalid email or password."); }
      login(u);
    }
    setLoading(false);
  };

  return (
    <div style={s.bg}>
      {/* Floating orbs */}
      <div style={{...s.orb, top: "10%", left: "15%", width: 300, height: 300, background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />
      <div style={{...s.orb, bottom: "15%", right: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)" }} />

      <div style={s.card}>
        {/* Logo */}
        <div style={s.logo}>
          <div style={s.logoIcon}>🎯</div>
          <div>
            <h1 style={s.logoTitle}>SkillPath <span style={s.logoPro}>PRO</span></h1>
            <p style={s.logoSub}>AI-Powered Career Intelligence</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={s.tabs}>
          {["login","register"].map(m => (
            <button key={m} onClick={() => switchMode(m)} style={{...s.tab, ...(mode===m ? s.tabActive : {})}}>
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={s.fields}>
          {mode === "register" && (
            <div style={s.fieldWrap}>
              <label style={s.label}>Full Name</label>
              <input name="name" value={form.name} onChange={handle} placeholder="Your name" style={s.input} />
            </div>
          )}
          <div style={s.fieldWrap}>
            <label style={s.label}>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@email.com" style={s.input} />
          </div>
          <div style={s.fieldWrap}>
            <label style={s.label}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" style={s.input}
              onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
        </div>

        {error   && <div style={s.errBox}>⚠ {error}</div>}
        {success && <div style={s.sucBox}>✓ {success}</div>}

        <button onClick={submit} style={s.submitBtn} disabled={loading}>
          {loading ? <span style={s.spinner} /> : (mode === "login" ? "Sign In →" : "Create Account →")}
        </button>

        <p style={s.switchTxt}>
          {mode === "login" ? "New here?" : "Have an account?"}{" "}
          <span style={s.switchLink} onClick={() => switchMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Create account" : "Sign in"}
          </span>
        </p>

        <div style={s.features}>
          {["CV Analysis", "Skill Assessment", "AI Roadmaps", "Interview Prep"].map(f => (
            <span key={f} style={s.featurePill}>✦ {f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  bg: { minHeight: "100vh", background: "#060612", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" },
  orb: { position: "absolute", borderRadius: "50%", pointerEvents: "none" },
  card: { background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 28, padding: "48px 44px", width: "100%", maxWidth: 440, boxShadow: "0 60px 120px rgba(0,0,0,0.8)", position: "relative", zIndex: 1 },
  logo: { display: "flex", alignItems: "center", gap: 16, marginBottom: 36, justifyContent: "center" },
  logoIcon: { fontSize: 48, filter: "drop-shadow(0 0 20px rgba(99,102,241,0.5))" },
  logoTitle: { fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", margin: 0 },
  logoPro: { background: "linear-gradient(135deg, #6366f1, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  logoSub: { color: "#44445a", fontSize: 13, margin: 0 },
  tabs: { display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 4, marginBottom: 28 },
  tab: { flex: 1, padding: "10px", background: "transparent", border: "none", color: "#44445a", cursor: "pointer", fontSize: 14, fontWeight: 600, borderRadius: 10, transition: "all 0.2s" },
  tabActive: { background: "rgba(99,102,241,0.2)", color: "#a5b4fc" },
  fields: { display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 6 },
  label: { color: "#44445a", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 },
  input: { padding: "13px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#e8e8f0", fontSize: 14, outline: "none", transition: "border-color 0.2s" },
  errBox: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "11px 14px", color: "#fca5a5", fontSize: 13, marginBottom: 16 },
  sucBox: { background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: "11px 14px", color: "#86efac", fontSize: 13, marginBottom: 16 },
  submitBtn: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 },
  spinner: { width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" },
  switchTxt: { textAlign: "center", color: "#33334a", fontSize: 13, marginBottom: 24 },
  switchLink: { color: "#6366f1", cursor: "pointer", fontWeight: 600 },
  features: { display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" },
  featurePill: { padding: "4px 10px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 20, color: "#44445a", fontSize: 11 },
};
