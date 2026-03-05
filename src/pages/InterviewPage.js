import { useState } from "react";
import CAREERS from "../data/careers";

export default function InterviewPage({ career }) {
  const c = CAREERS[career];
  const [open, setOpen] = useState({});
  const toggle = key => setOpen(p => ({ ...p, [key]: !p[key] }));
  return (
    <div style={s.page}>
      <h1 style={s.title}>Interview Preparation</h1>
      <p style={s.sub}>Common questions asked in real {c.label} interviews</p>
      {c.interview.map((cat, ci) => (
        <div key={ci} style={s.section}>
          <h2 style={{ ...s.catTitle, borderLeft: `4px solid ${c.color}` }}>{cat.category}</h2>
          {cat.questions.map((q, qi) => {
            const key = `${ci}-${qi}`;
            return (
              <div key={qi} style={s.qCard} onClick={() => toggle(key)}>
                <div style={s.qRow}>
                  <span style={s.qNum}>Q{qi + 1}</span>
                  <span style={s.qText}>{q}</span>
                  <span style={{ color: c.color, fontSize: 12 }}>{open[key] ? "▲" : "▼"}</span>
                </div>
                {open[key] && (
                  <div style={s.hint}>
                    💡 Focus on: clear definition, real-world example, edge cases, and how this applies to {c.label} roles. Practice answering out loud.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const s = {
  page: { padding: "44px 48px", maxWidth: 860, margin: "0 auto" },
  title: { fontFamily: "'Syne',sans-serif", color: "#fff", fontSize: 28, fontWeight: 800, marginBottom: 6 },
  sub: { color: "#33334a", fontSize: 14, marginBottom: 36 },
  section: { marginBottom: 36 },
  catTitle: { color: "#e8e8f0", fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, paddingLeft: 16, marginBottom: 16 },
  qCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 20px", marginBottom: 8, cursor: "pointer" },
  qRow: { display: "flex", alignItems: "center", gap: 12 },
  qNum: { color: "#33334a", fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.06)", padding: "3px 8px", borderRadius: 6, flexShrink: 0 },
  qText: { color: "#c8c8d8", fontSize: 14, flex: 1, lineHeight: 1.5 },
  hint: { marginTop: 14, padding: "12px 16px", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: 10, color: "#7a7a9a", fontSize: 13, lineHeight: 1.7 },
};
