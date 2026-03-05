import { useState } from "react";
import CAREERS from "../data/careers";
import DB from "../data/db";

export default function RoadmapPage({ career, user }) {
  const c = CAREERS[career];
  const [completed, setCompleted] = useState(() =>
    DB.getProgress(user.id, career).reduce((acc, r) => { acc[r.topic] = r.completed; return acc; }, {})
  );

  const toggle = (topic) => {
    const val = !completed[topic];
    setCompleted(p => ({ ...p, [topic]: val }));
    DB.setProgress(user.id, career, topic, val);
  };

  const allTopics = c.roadmap.flatMap(p => p.steps);
  const done = allTopics.filter(t => completed[t]).length;
  const pct = Math.round((done / allTopics.length) * 100);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Learning Roadmap</h1>
          <p style={s.sub}>Click topics to mark them complete</p>
        </div>
        <div style={s.overallBadge}>
          <span style={{ ...s.overallPct, color: c.color }}>{pct}%</span>
          <span style={{ color: "#33334a", fontSize: 12 }}>{done}/{allTopics.length} done</span>
        </div>
      </div>

      <div style={s.progressWrap}>
        <div style={s.track}><div style={{ ...s.fill, width: `${pct}%`, background: c.gradient }} /></div>
      </div>

      <div style={s.grid}>
        {c.roadmap.map((phase, pi) => {
          const phaseDone = phase.steps.filter(t => completed[t]).length;
          const phasePct = Math.round((phaseDone / phase.steps.length) * 100);
          return (
            <div key={pi} style={{ ...s.card, borderTop: `3px solid ${c.color}` }}>
              <div style={s.phaseHead}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{phase.icon}</span>
                  <div>
                    <p style={{ color: "#33334a", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Phase {pi + 1}</p>
                    <p style={{ color: "#e8e8f0", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15 }}>{phase.phase}</p>
                  </div>
                </div>
                <div style={{ ...s.phasePct, color: phasePct === 100 ? "#22c55e" : c.accent }}>{phasePct}%</div>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 16, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${phasePct}%`, background: phasePct === 100 ? "#22c55e" : c.gradient, borderRadius: 2, transition: "width 0.4s" }} />
              </div>
              {phase.steps.map((step, si) => (
                <div key={si} style={s.step} onClick={() => toggle(step)}>
                  <div style={{ ...s.check, ...(completed[step] ? { background: c.color, borderColor: c.color } : {}) }}>
                    {completed[step] && <span style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>✓</span>}
                  </div>
                  <span style={{ color: completed[step] ? "#33334a" : "#c8c8d8", textDecoration: completed[step] ? "line-through" : "none", fontSize: 14, transition: "all 0.2s" }}>{step}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  page: { padding: "44px 48px", maxWidth: 1000, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { fontFamily: "'Syne',sans-serif", color: "#fff", fontSize: 28, fontWeight: 800, marginBottom: 4 },
  sub: { color: "#33334a", fontSize: 14 },
  overallBadge: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
  overallPct: { fontFamily: "'Syne',sans-serif", fontSize: 38, fontWeight: 900, lineHeight: 1 },
  progressWrap: { marginBottom: 40 },
  track: { height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 4, transition: "width 0.4s ease" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 24 },
  phaseHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  phasePct: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18 },
  step: { display: "flex", alignItems: "center", gap: 12, padding: "9px 0", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)", userSelect: "none" },
  check: { width: 22, height: 22, borderRadius: 6, border: "2px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" },
};
