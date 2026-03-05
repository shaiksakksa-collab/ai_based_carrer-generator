import CAREERS from "../data/careers";
import DB from "../data/db";
import { ASSESSMENTS, getScoreLabel } from "../data/assessments";

export default function ProgressPage({ career, user }) {
  const c = CAREERS[career];
  const progress     = DB.getProgress(user.id, career);
  const plannerTasks = DB.getPlanner(user.id, career);
  const assessment   = DB.getAssessment(user.id, career);
  const sessions     = DB.getSessionCount(user.id, career);
  const cv           = DB.getCV(user.id);

  const allTopics = c.roadmap.flatMap(p => p.steps);
  const done      = progress.filter(p => p.completed).length;
  const pct       = Math.round((done / allTopics.length) * 100);
  const planDone  = plannerTasks.filter(t => t.done).length;
  const testPct   = assessment ? Math.round((assessment.score / assessment.total) * 100) : null;
  const testLabel = testPct !== null ? getScoreLabel(testPct) : null;

  const stats = [
    { label: "Roadmap", value: `${pct}%`, sub: `${done}/${allTopics.length} topics`, color: c.color },
    { label: "Test Score", value: testPct !== null ? `${testPct}%` : "—", sub: testLabel?.label || "Not taken", color: testLabel?.color || "#33334a" },
    { label: "Tasks Done", value: planDone, sub: `of ${plannerTasks.length}`, color: "#22c55e" },
    { label: "Sessions", value: sessions, sub: "visits", color: "#f59e0b" },
    { label: "CV", value: cv ? "✓" : "—", sub: cv ? "Uploaded" : "Missing", color: cv ? "#22c55e" : "#33334a" },
  ];

  return (
    <div style={s.page}>
      <h1 style={s.title}>My Progress</h1>
      <p style={s.sub}>Track all your learning achievements in one place</p>

      <div style={s.statsGrid}>
        {stats.map((st, i) => (
          <div key={i} style={s.statCard}>
            <div style={{ ...s.statVal, color: st.color }}>{st.value}</div>
            <div style={s.statLabel}>{st.label}</div>
            <div style={s.statSub}>{st.sub}</div>
          </div>
        ))}
      </div>

      {/* Assessment score breakdown */}
      {assessment && (
        <div style={s.card}>
          <h3 style={s.cardTitle}>📝 Assessment Results</h3>
          <div style={s.scoreRow}>
            <span style={{ ...s.bigScore, color: testLabel.color }}>{testPct}%</span>
            <div>
              <p style={{ color: "#e8e8f0", fontWeight: 700 }}>{testLabel.label} — {testLabel.icon}</p>
              <p style={{ color: "#33334a", fontSize: 13 }}>{assessment.score}/{assessment.total} correct · {ASSESSMENTS[career].questions.length} questions</p>
              <p style={{ color: "#33334a", fontSize: 12 }}>{new Date(assessment.completed_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div style={s.scoreBar}>
            <div style={{ ...s.scoreBarFill, width: `${testPct}%`, background: testLabel.color }} />
            <div style={{ ...s.passMark, left: `${ASSESSMENTS[career].passMark}%` }} />
          </div>
          <p style={{ color: "#33334a", fontSize: 12, marginTop: 6 }}>Pass mark: {ASSESSMENTS[career].passMark}%</p>
        </div>
      )}

      {/* Roadmap breakdown */}
      <div style={s.card}>
        <h3 style={s.cardTitle}>🗺 Roadmap Progress by Phase</h3>
        {c.roadmap.map((phase, pi) => {
          const pd = phase.steps.filter(step => progress.find(p => p.topic === step && p.completed)).length;
          const pp = Math.round((pd / phase.steps.length) * 100);
          return (
            <div key={pi} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#c8c8d8", fontSize: 14 }}>{phase.icon} {phase.phase}</span>
                <span style={{ color: c.color, fontSize: 13, fontWeight: 700 }}>{pd}/{phase.steps.length}</span>
              </div>
              <div style={s.track}><div style={{ ...s.fill, width: `${pp}%`, background: pp === 100 ? "#22c55e" : c.gradient }} /></div>
            </div>
          );
        })}
      </div>

      {/* SQL snapshot */}
      <div style={s.card}>
        <h3 style={s.cardTitle}>🗄️ SQL — Live Data</h3>
        <pre style={s.code}>
{`SELECT u.name, p.topic, p.completed, a.score, a.total
FROM users u
LEFT JOIN progress p ON p.user_id = u.id AND p.career = '${career}'
LEFT JOIN assessments a ON a.user_id = u.id AND a.career = '${career}'
WHERE u.id = ${user.id};

-- ${progress.length} progress rows | ${assessment ? `Score: ${assessment.score}/${assessment.total}` : "No assessment"}`}
        </pre>
      </div>
    </div>
  );
}

const s = {
  page: { padding: "44px 48px", maxWidth: 960, margin: "0 auto" },
  title: { fontFamily: "'Syne',sans-serif", color: "#fff", fontSize: 28, fontWeight: 800, marginBottom: 6 },
  sub: { color: "#33334a", fontSize: 14, marginBottom: 36 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 },
  statCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 24, textAlign: "center" },
  statVal: { fontFamily: "'Syne',sans-serif", fontSize: 38, fontWeight: 900, lineHeight: 1, marginBottom: 8 },
  statLabel: { color: "#e8e8f0", fontWeight: 700, fontSize: 14, marginBottom: 4 },
  statSub: { color: "#33334a", fontSize: 12 },
  card: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 28, marginBottom: 20 },
  cardTitle: { color: "#44445a", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 22 },
  scoreRow: { display: "flex", alignItems: "center", gap: 24, marginBottom: 20 },
  bigScore: { fontFamily: "'Syne',sans-serif", fontSize: 56, fontWeight: 900 },
  scoreBar: { height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 5, overflow: "visible", position: "relative" },
  scoreBarFill: { height: "100%", borderRadius: 5, transition: "width 1s ease" },
  passMark: { position: "absolute", top: -4, width: 2, height: 18, background: "#f59e0b" },
  track: { height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 4, transition: "width 0.5s ease" },
  code: { background: "rgba(0,0,0,0.4)", borderRadius: 12, padding: "18px 20px", fontSize: 12, lineHeight: 1.9, color: "#6366f1", border: "1px solid rgba(99,102,241,0.1)", overflowX: "auto", fontFamily: "monospace" },
};
