import CAREERS from "../data/careers";
import DB from "../data/db";

export default function HomePage({ navigate, user, onLogout }) {
  const cv = DB.getCV(user.id);
  const allAssessments = DB.getAllAssessments(user.id);

  return (
    <div style={s.bg}>
      {/* Top nav */}
      <nav style={s.nav}>
        <div style={s.brand}>
          <span style={{ fontSize: 24 }}>🎯</span>
          <span style={s.brandTxt}>SkillPath <span style={s.brandPro}>PRO</span></span>
        </div>
        <div style={s.navRight}>
          <button onClick={() => navigate("cv", Object.keys(CAREERS)[0])} style={s.navBtn}>
            📄 {cv ? "Update CV" : "Upload CV"}
          </button>
          <div style={s.userChip}>
            <div style={s.userAvatar}>{user.name[0].toUpperCase()}</div>
            <span style={s.userName}>{user.name}</span>
          </div>
          <button onClick={onLogout} style={s.logoutBtn}>Logout</button>
        </div>
      </nav>

      {/* Hero */}
      <header style={s.hero}>
        <div style={s.heroGlow} />
        <p style={s.heroEyebrow}>✦ POWERED BY AI</p>
        <h1 style={s.heroTitle}>Your Smart Career<br /><span style={s.heroGrad}>Intelligence Platform</span></h1>
        <p style={s.heroSub}>Upload your CV for AI analysis, take a skill screening test, and get a personalized roadmap to your dream tech career.</p>

        {/* Quick stats */}
        <div style={s.heroStats}>
          {[
            { n: cv ? "✓" : "—", l: "CV Uploaded", color: cv ? "#22c55e" : "#33334a" },
            { n: allAssessments.length, l: "Tests Taken", color: "#6366f1" },
            { n: "2", l: "Career Tracks", color: "#f97316" },
            { n: "30+", l: "Courses", color: "#8b5cf6" },
          ].map(({ n, l, color }) => (
            <div key={l} style={s.heroStat}>
              <span style={{ ...s.heroStatN, color }}>{n}</span>
              <span style={s.heroStatL}>{l}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Career Cards */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>Choose Your Career Path</h2>
        <div style={s.grid}>
          {Object.entries(CAREERS).map(([key, c]) => {
            const assessment = DB.getAssessment(user.id, key);
            const pct = assessment ? Math.round((assessment.score / assessment.total) * 100) : null;
            return (
              <div key={key} style={s.card} onClick={() => navigate("roadmap", key)}>
                <div style={{ ...s.cardGlow, background: c.gradient, opacity: 0.07 }} />

                {/* Header */}
                <div style={s.cardHead}>
                  <span style={{ fontSize: 52 }}>{c.icon}</span>
                  {pct !== null && (
                    <div style={{ ...s.scoreBadge, borderColor: pct >= 60 ? "#22c55e44" : "#ef444444" }}>
                      <span style={{ color: pct >= 60 ? "#22c55e" : "#ef4444", fontWeight: 800 }}>{pct}%</span>
                      <span style={{ color: "#33334a", fontSize: 10 }}>SCORED</span>
                    </div>
                  )}
                </div>

                <h2 style={{ ...s.cardTitle, color: c.color }}>{c.label}</h2>
                <p style={s.cardDesc}>{c.description}</p>

                {/* Roles */}
                <div style={s.roles}>
                  {c.roles.slice(0, 3).map(r => (
                    <span key={r} style={{ ...s.roleTag, background: c.color + "15", color: c.color }}>{r}</span>
                  ))}
                </div>

                <div style={s.cardFooter}>
                  <span style={s.salary}>💰 {c.avgSalary}</span>
                  <div style={s.cardActions}>
                    <button onClick={e => { e.stopPropagation(); navigate("assessment", key); }}
                      style={{ ...s.testBtn, border: `1px solid ${c.color}44`, color: c.color }}>
                      {assessment ? "Retake Test" : "Take Test"}
                    </button>
                    <button style={{ ...s.exploreBtn, background: c.gradient }}>
                      Explore →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CV Banner if not uploaded */}
      {!cv && (
        <section style={s.cvBanner}>
          <div style={s.cvBannerInner}>
            <div>
              <h3 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontSize: 22, marginBottom: 8 }}>📄 Upload Your CV for AI-Powered Analysis</h3>
              <p style={{ color: "#44445a", fontSize: 14 }}>Get personalized career recommendations based on your skills, experience, and education.</p>
            </div>
            <button onClick={() => navigate("cv", Object.keys(CAREERS)[0])} style={s.cvBannerBtn}>
              Upload CV →
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

const s = {
  bg: { minHeight: "100vh", background: "#060612" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "sticky", top: 0, background: "rgba(6,6,18,0.9)", backdropFilter: "blur(20px)", zIndex: 50 },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  brandTxt: { fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#fff" },
  brandPro: { background: "linear-gradient(135deg,#6366f1,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  navRight: { display: "flex", alignItems: "center", gap: 12 },
  navBtn: { padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  userChip: { display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 40 },
  userAvatar: { width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 },
  userName: { color: "#a0a0b8", fontSize: 13 },
  logoutBtn: { padding: "8px 16px", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: "#44445a", borderRadius: 10, cursor: "pointer", fontSize: 13 },
  hero: { textAlign: "center", padding: "90px 48px 60px", position: "relative", overflow: "hidden" },
  heroGlow: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)", pointerEvents: "none" },
  heroEyebrow: { color: "#6366f1", fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 20 },
  heroTitle: { fontFamily: "'Syne',sans-serif", fontSize: 56, fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 20 },
  heroGrad: { background: "linear-gradient(135deg,#6366f1,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { color: "#44445a", maxWidth: 560, margin: "0 auto 48px", fontSize: 17, lineHeight: 1.7 },
  heroStats: { display: "flex", justifyContent: "center", gap: 48 },
  heroStat: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  heroStatN: { fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800 },
  heroStatL: { color: "#33334a", fontSize: 12 },
  section: { padding: "20px 48px 80px", maxWidth: 1100, margin: "0 auto" },
  sectionTitle: { fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 32, textAlign: "center" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 28 },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 28, padding: 36, cursor: "pointer", position: "relative", overflow: "hidden", transition: "transform 0.2s, border-color 0.2s" },
  cardGlow: { position: "absolute", inset: 0, pointerEvents: "none" },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  scoreBadge: { display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid", borderRadius: 12 },
  cardTitle: { fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 10 },
  cardDesc: { color: "#44445a", fontSize: 14, lineHeight: 1.7, marginBottom: 20 },
  roles: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 },
  roleTag: { padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  cardFooter: { display: "flex", flexDirection: "column", gap: 14 },
  salary: { color: "#33334a", fontSize: 13 },
  cardActions: { display: "flex", gap: 10 },
  testBtn: { flex: 1, padding: "11px", background: "transparent", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" },
  exploreBtn: { flex: 1, padding: "11px", border: "none", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  cvBanner: { padding: "0 48px 60px", maxWidth: 1100, margin: "0 auto" },
  cvBannerInner: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 20, padding: "32px 40px" },
  cvBannerBtn: { padding: "13px 28px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", flexShrink: 0 },
};
