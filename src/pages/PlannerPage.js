import { useState } from "react";
import CAREERS from "../data/careers";
import DB from "../data/db";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function PlannerPage({ career, user }) {
  const c = CAREERS[career];
  const [tasks, setTasks] = useState(() => DB.getPlanner(user.id, career));
  const [newTask, setNewTask] = useState({ day: "Monday", task: "" });

  const refresh = () => setTasks(DB.getPlanner(user.id, career));
  const add = () => { if (!newTask.task.trim()) return; DB.addPlannerTask(user.id, career, newTask.day, newTask.task.trim()); setNewTask(p => ({ ...p, task: "" })); refresh(); };
  const toggle = id => { DB.togglePlannerTask(id); refresh(); };
  const del = id => { DB.deletePlannerTask(id); refresh(); };

  return (
    <div style={s.page}>
      <h1 style={s.title}>Study Planner</h1>
      <p style={s.sub}>Organize your weekly study schedule</p>

      <div style={s.addRow}>
        <select value={newTask.day} onChange={e => setNewTask(p => ({ ...p, day: e.target.value }))} style={s.select}>
          {DAYS.map(d => <option key={d}>{d}</option>)}
        </select>
        <input value={newTask.task} onChange={e => setNewTask(p => ({ ...p, task: e.target.value }))}
          onKeyDown={e => e.key === "Enter" && add()} placeholder="Add a study task..." style={s.input} />
        <button onClick={add} style={{ ...s.addBtn, background: c.gradient }}>+ Add</button>
      </div>

      <h2 style={s.secTitle}>📋 Recommended Study Plan</h2>
      <div style={s.planGrid}>
        {c.plan.map((p, i) => (
          <div key={i} style={s.planCard}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ color: c.accent, fontWeight: 700, fontSize: 13 }}>{p.week}</span>
              <span style={{ color: "#33334a", fontSize: 12 }}>{p.focus}</span>
            </div>
            {p.tasks.map((t, ti) => <div key={ti} style={s.planTask}><span style={{ color: c.color }}>→</span> {t}</div>)}
          </div>
        ))}
      </div>

      <h2 style={s.secTitle}>📌 My Tasks</h2>
      {DAYS.map(day => {
        const dt = tasks.filter(t => t.day === day);
        if (!dt.length) return null;
        return (
          <div key={day} style={s.dayBlock}>
            <h3 style={{ color: c.color, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{day}</h3>
            {dt.map(t => (
              <div key={t.id} style={s.taskRow}>
                <div style={{ ...s.check, ...(t.done ? { background: c.color, borderColor: c.color } : {}) }} onClick={() => toggle(t.id)}>
                  {t.done && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
                </div>
                <span style={{ flex: 1, color: t.done ? "#33334a" : "#c8c8d8", textDecoration: t.done ? "line-through" : "none", fontSize: 14 }}>{t.task}</span>
                <button onClick={() => del(t.id)} style={s.delBtn}>✕</button>
              </div>
            ))}
          </div>
        );
      })}
      {!tasks.length && <p style={{ color: "#33334a", fontSize: 14 }}>No tasks yet. Add one above!</p>}
    </div>
  );
}

const s = {
  page: { padding: "44px 48px", maxWidth: 960, margin: "0 auto" },
  title: { fontFamily: "'Syne',sans-serif", color: "#fff", fontSize: 28, fontWeight: 800, marginBottom: 6 },
  sub: { color: "#33334a", fontSize: 14, marginBottom: 36 },
  addRow: { display: "flex", gap: 10, marginBottom: 40, alignItems: "center" },
  select: { padding: "12px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#e8e8f0", fontSize: 13, flexShrink: 0 },
  input: { flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#e8e8f0", fontSize: 14, outline: "none", fontFamily: "inherit" },
  addBtn: { padding: "12px 22px", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", flexShrink: 0 },
  secTitle: { color: "#33334a", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 18 },
  planGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 40 },
  planCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 22 },
  planTask: { color: "#7a7a9a", fontSize: 13, padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", lineHeight: 1.5 },
  dayBlock: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 22, marginBottom: 14 },
  taskRow: { display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  check: { width: 22, height: 22, borderRadius: 6, border: "2px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" },
  delBtn: { background: "transparent", border: "none", color: "#33334a", cursor: "pointer", fontSize: 15, padding: "0 4px" },
};
