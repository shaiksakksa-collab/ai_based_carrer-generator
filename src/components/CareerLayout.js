import CAREERS from "../data/careers";
import RoadmapPage   from "../pages/RoadmapPage";
import CoursesPage   from "../pages/CoursesPage";
import YouTubePage   from "../pages/YouTubePage";
import InterviewPage from "../pages/InterviewPage";
import PlannerPage   from "../pages/PlannerPage";
import ProgressPage  from "../pages/ProgressPage";
import CVPage        from "../pages/CVPage";
import AssessmentPage from "../pages/AssessmentPage";

const TABS = [
  { id: "cv",         icon: "📄", label: "My CV"       },
  { id: "assessment", icon: "📝", label: "Assessment"  },
  { id: "roadmap",    icon: "🗺",  label: "Roadmap"    },
  { id: "courses",    icon: "📚", label: "Courses"     },
  { id: "youtube",    icon: "▶",  label: "YouTube"     },
  { id: "interview",  icon: "💼", label: "Interview"   },
  { id: "planner",    icon: "📅", label: "Planner"     },
  { id: "progress",   icon: "✅", label: "Progress"    },
];

export default function CareerLayout({ career, page, navigate, user, onLogout }) {
  const c = CAREERS[career];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#060612" }}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        {/* Brand */}
        <div style={s.sideTop}>
          <button onClick={() => navigate("home")} style={s.homeLogo}>
            <span style={{ fontSize: 22 }}>🎯</span>
            <span style={s.logoTxt}>SkillPath <span style={s.logoPro}>PRO</span></span>
          </button>
        </div>

        {/* Career pill */}
        <div style={{ padding: "12px 16px" }}>
          <div style={{ ...s.careerPill, background: c.color + "15", border: `1px solid ${c.color}30` }}>
            <span style={{ fontSize: 20 }}>{c.icon}</span>
            <span style={{ color: c.color, fontWeight: 700, fontSize: 13 }}>{c.label}</span>
          </div>
          <button onClick={() => navigate("home")} style={s.switchBtn}>← Switch Career</button>
        </div>

        <div style={s.divider} />

        {/* Nav */}
        <nav style={{ padding: "8px 10px", flex: 1 }}>
          {TABS.map((t) => {
            const active = page === t.id;
            return (
              <button key={t.id} onClick={() => navigate(t.id, career)}
                style={{ ...s.navBtn, ...(active ? { background: c.color + "18", color: c.accent, borderLeft: `3px solid ${c.color}` } : {}) }}>
                <span style={{ fontSize: 16, width: 20 }}>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={s.divider} />

        {/* Footer */}
        <div style={s.sideFooter}>
          <div style={s.userRow}>
            <div style={{ ...s.avatar, background: c.gradient }}>{user.name[0]}</div>
            <div>
              <p style={{ color: "#a0a0b8", fontSize: 13, fontWeight: 600 }}>{user.name}</p>
              <p style={{ color: "#33334a", fontSize: 11 }}>{user.email}</p>
            </div>
          </div>
          <button onClick={onLogout} style={s.logoutBtn}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {page === "cv"         && <CVPage         user={user} career={career} navigate={navigate} />}
        {page === "assessment" && <AssessmentPage career={career} user={user} navigate={navigate} />}
        {page === "roadmap"    && <RoadmapPage    career={career} user={user} />}
        {page === "courses"    && <CoursesPage    career={career} />}
        {page === "youtube"    && <YouTubePage    career={career} />}
        {page === "interview"  && <InterviewPage  career={career} />}
        {page === "planner"    && <PlannerPage    career={career} user={user} />}
        {page === "progress"   && <ProgressPage   career={career} user={user} />}
      </main>
    </div>
  );
}

const s = {
  sidebar: { width: 240, minHeight: "100vh", background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto", flexShrink: 0 },
  sideTop: { padding: "22px 16px 16px" },
  homeLogo: { display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", cursor: "pointer", width: "100%" },
  logoTxt: { fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "#fff" },
  logoPro: { background: "linear-gradient(135deg,#6366f1,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  careerPill: { display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 12, marginBottom: 8 },
  switchBtn: { background: "transparent", border: "none", color: "#33334a", fontSize: 12, cursor: "pointer", padding: "0 4px" },
  divider: { height: 1, background: "rgba(255,255,255,0.05)", margin: "4px 0" },
  navBtn: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 16px", background: "transparent", border: "none", borderLeft: "3px solid transparent", color: "#33334a", cursor: "pointer", fontSize: 13, fontWeight: 500, textAlign: "left", borderRadius: "0 8px 8px 0", marginBottom: 2, transition: "all 0.15s" },
  sideFooter: { padding: "16px" },
  userRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  avatar: { width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 },
  logoutBtn: { width: "100%", padding: "9px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#33334a", borderRadius: 10, cursor: "pointer", fontSize: 12 },
  main: { flex: 1, overflowY: "auto" },
};
