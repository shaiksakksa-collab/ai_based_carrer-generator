import CAREERS from "../data/careers";

const LEVEL_CLR = { Beginner:"#22c55e", Intermediate:"#f59e0b", Advanced:"#ef4444", "Beginner–Adv":"#8b5cf6", Free:"#06b6d4", "Free + Cert":"#06b6d4" };

export default function CoursesPage({ career }) {
  const c = CAREERS[career];
  return (
    <div style={s.page}>
      <h1 style={s.title}>Curated Courses</h1>
      <p style={s.sub}>Hand-picked courses to accelerate your learning</p>
      <div style={s.grid}>
        {c.courses.map((course, i) => {
          const lc = LEVEL_CLR[course.level] || "#888";
          return (
            <div key={i} style={s.card}>
              <div style={s.cardTop}>
                <span style={{ ...s.badge, background: lc+"22", color: lc }}>{course.level}</span>
                <span style={s.dur}>⏱ {course.duration}</span>
              </div>
              <h3 style={s.courseTitle}>{course.title}</h3>
              <p style={s.provider}>by {course.provider}</p>
              <a href={course.link} target="_blank" rel="noopener noreferrer" style={{ ...s.btn, background: c.gradient }}>View Course →</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  page: { padding: "44px 48px", maxWidth: 1000, margin: "0 auto" },
  title: { fontFamily: "'Syne',sans-serif", color: "#fff", fontSize: 28, fontWeight: 800, marginBottom: 6 },
  sub: { color: "#33334a", fontSize: 14, marginBottom: 36 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 26 },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  badge: { padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 },
  dur: { color: "#33334a", fontSize: 12 },
  courseTitle: { color: "#e8e8f0", fontSize: 16, fontWeight: 700, marginBottom: 6, lineHeight: 1.4 },
  provider: { color: "#44445a", fontSize: 13, marginBottom: 20 },
  btn: { display: "block", textAlign: "center", padding: "12px", borderRadius: 12, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700 },
};
