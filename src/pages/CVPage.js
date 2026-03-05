import { useState } from "react";
import DB from "../data/db";
import CAREERS from "../data/careers";

const SKILL_SUGGESTIONS = {
  datascience: ["Python", "R", "SQL", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "Tableau", "Power BI", "Statistics", "Machine Learning", "Deep Learning", "NLP", "Excel", "Spark", "Hadoop", "AWS", "GCP"],
  webdev: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Vue", "Angular", "Node.js", "Express", "Next.js", "PostgreSQL", "MongoDB", "Docker", "Git", "AWS", "Tailwind CSS", "GraphQL", "REST APIs", "Redis"],
};

export default function CVPage({ user, career, navigate }) {
  const existing = DB.getCV(user.id);
  const [step, setStep] = useState(existing ? "preview" : "form");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [form, setForm] = useState({
    name: existing?.name || user.name,
    email: existing?.email || user.email,
    phone: existing?.phone || "",
    location: existing?.location || "",
    summary: existing?.summary || "",
    skills: existing?.skills || [],
    experience: existing?.experience || [{ company: "", role: "", duration: "", description: "" }],
    education: existing?.education || [{ institution: "", degree: "", year: "" }],
    github: existing?.github || "",
    linkedin: existing?.linkedin || "",
  });

  const [skillInput, setSkillInput] = useState("");

  const handleField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = (skill) => {
    if (skill && !form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill] });
    }
    setSkillInput("");
  };

  const removeSkill = (s) => setForm({ ...form, skills: form.skills.filter(x => x !== s) });

  const updateExp = (i, field, val) => {
    const exp = [...form.experience];
    exp[i] = { ...exp[i], [field]: val };
    setForm({ ...form, experience: exp });
  };

  const updateEdu = (i, field, val) => {
    const edu = [...form.education];
    edu[i] = { ...edu[i], [field]: val };
    setForm({ ...form, education: edu });
  };

  const saveAndAnalyze = async () => {
    DB.upsertCV(user.id, form);
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2800));

    // AI Analysis simulation
    const c = CAREERS[career];
    const careerSkills = SKILL_SUGGESTIONS[career];
    const matchedSkills = form.skills.filter(s => careerSkills.some(cs => cs.toLowerCase() === s.toLowerCase()));
    const matchPct = Math.min(100, Math.round((matchedSkills.length / Math.max(form.skills.length, 1)) * 100));
    const expYears = form.experience.filter(e => e.company).length;
    const hasEdu = form.education.some(e => e.institution);
    const missingSkills = careerSkills.filter(cs => !form.skills.some(s => s.toLowerCase() === cs.toLowerCase())).slice(0, 5);

    let readiness = Math.min(95, matchPct * 0.5 + (expYears > 0 ? 25 : 0) + (hasEdu ? 15 : 0) + (form.skills.length > 5 ? 10 : 0));

    setAnalysisResult({
      matchedSkills,
      missingSkills,
      readiness: Math.max(20, Math.round(readiness)),
      matchPct,
      strengths: [
        matchedSkills.length > 3 ? `Strong ${career === 'datascience' ? 'data' : 'web'} skill set` : null,
        expYears > 0 ? `${expYears} relevant experience entr${expYears > 1 ? 'ies' : 'y'}` : null,
        hasEdu ? "Educational background listed" : null,
        form.github ? "GitHub profile linked" : null,
        form.summary.length > 50 ? "Professional summary written" : null,
      ].filter(Boolean),
      improvements: [
        missingSkills.length > 0 ? `Learn: ${missingSkills.slice(0,3).join(", ")}` : null,
        !form.github ? "Add GitHub profile link" : null,
        form.skills.length < 5 ? "Add more relevant skills" : null,
        form.experience.every(e => !e.description) ? "Add job descriptions to experience" : null,
      ].filter(Boolean),
    });

    setAnalyzing(false);
    setStep("analysis");
  };

  if (analyzing) {
    return (
      <div style={s.analysisLoading}>
        <div style={s.loadingCard}>
          <div style={s.loadingIcon}>🤖</div>
          <h2 style={s.loadingTitle}>Analyzing Your CV...</h2>
          <p style={s.loadingSub}>Our AI is evaluating your profile against {CAREERS[career].label} requirements</p>
          <div style={s.loadingBar}><div style={s.loadingFill} /></div>
          {["Parsing skills & experience...", "Matching against career requirements...", "Generating recommendations..."].map((t, i) => (
            <div key={i} style={{ ...s.loadingStep, animationDelay: `${i * 0.8}s` }}>
              <span style={{ color: "#6366f1" }}>✦</span> {t}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === "analysis" && analysisResult) {
    const r = analysisResult;
    const readColor = r.readiness >= 70 ? "#22c55e" : r.readiness >= 40 ? "#f59e0b" : "#ef4444";
    return (
      <div style={s.page}>
        <div style={s.pageHeader}>
          <button onClick={() => setStep("form")} style={s.backBtn}>← Edit CV</button>
          <h1 style={s.pageTitle}>AI CV Analysis</h1>
          <button onClick={() => navigate("assessment", career)} style={s.nextBtn}>Take Assessment →</button>
        </div>

        <div style={s.analysisGrid}>
          {/* Readiness gauge */}
          <div style={s.gaugeCard}>
            <h3 style={s.cardLabel}>Career Readiness Score</h3>
            <div style={s.gauge}>
              <svg width="180" height="100" viewBox="0 0 180 100">
                <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" strokeLinecap="round" />
                <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke={readColor} strokeWidth="16" strokeLinecap="round"
                  strokeDasharray={`${(r.readiness / 100) * 251.2} 251.2`} style={{ transition: "stroke-dasharray 1s ease" }} />
              </svg>
              <div style={s.gaugeValue}>
                <span style={{ ...s.gaugePct, color: readColor }}>{r.readiness}%</span>
                <span style={s.gaugeLabel}>Readiness</span>
              </div>
            </div>
            <p style={s.gaugeDesc}>{r.readiness >= 70 ? "Great profile! Start applying." : r.readiness >= 40 ? "Good foundation. Keep learning." : "Build your skills further."}</p>
          </div>

          {/* Skill match */}
          <div style={s.matchCard}>
            <h3 style={s.cardLabel}>Skill Match for {CAREERS[career].label}</h3>
            <div style={s.matchPct}><span style={{ color: "#6366f1", fontFamily: "'Syne',sans-serif", fontSize: 48, fontWeight: 800 }}>{r.matchPct}%</span></div>
            <div style={s.skillTags}>
              <p style={{ color: "#44445a", fontSize: 12, marginBottom: 8 }}>MATCHED SKILLS</p>
              {r.matchedSkills.length ? r.matchedSkills.map(sk => (
                <span key={sk} style={s.skillGreen}>{sk}</span>
              )) : <span style={{ color: "#33334a", fontSize: 13 }}>No matching skills found</span>}
            </div>
            <div style={s.skillTags}>
              <p style={{ color: "#44445a", fontSize: 12, margin: "12px 0 8px" }}>SKILLS TO LEARN</p>
              {r.missingSkills.map(sk => <span key={sk} style={s.skillRed}>{sk}</span>)}
            </div>
          </div>

          {/* Strengths */}
          <div style={s.insightCard}>
            <h3 style={s.cardLabel}>✅ Strengths</h3>
            {r.strengths.length ? r.strengths.map((t, i) => (
              <div key={i} style={s.insightRow}><span style={{ color: "#22c55e" }}>✓</span> {t}</div>
            )) : <p style={{ color: "#33334a", fontSize: 13 }}>Complete your profile to see strengths.</p>}
          </div>

          {/* Improvements */}
          <div style={s.insightCard}>
            <h3 style={s.cardLabel}>🚀 Recommendations</h3>
            {r.improvements.length ? r.improvements.map((t, i) => (
              <div key={i} style={s.insightRow}><span style={{ color: "#f97316" }}>→</span> {t}</div>
            )) : <p style={{ color: "#22c55e", fontSize: 13 }}>Your profile looks complete!</p>}
          </div>
        </div>

        <div style={s.ctaRow}>
          <button onClick={() => navigate("assessment", career)} style={s.ctaBtn}>
            📝 Take Skill Assessment →
          </button>
          <button onClick={() => navigate("roadmap", career)} style={s.ctaSecondary}>
            🗺 View Roadmap
          </button>
        </div>
      </div>
    );
  }

  if (step === "preview" && existing) {
    return (
      <div style={s.page}>
        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>📄 Your CV Profile</h1>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep("form")} style={s.editBtn}>Edit CV</button>
            <button onClick={saveAndAnalyze} style={s.nextBtn}>Analyze with AI →</button>
          </div>
        </div>
        <div style={s.previewCard}>
          <h2 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontSize: 26, marginBottom: 4 }}>{existing.name}</h2>
          <p style={{ color: "#44445a", marginBottom: 20 }}>{existing.email} · {existing.phone} · {existing.location}</p>
          {existing.summary && <p style={{ color: "#a0a0b8", lineHeight: 1.7, marginBottom: 24, padding: "16px 20px", background: "rgba(255,255,255,0.03)", borderRadius: 12, borderLeft: "3px solid #6366f1" }}>{existing.summary}</p>}
          <h3 style={s.previewSection}>Skills</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
            {existing.skills.map(sk => <span key={sk} style={s.skillChip}>{sk}</span>)}
          </div>
          {existing.experience.filter(e => e.company).map((e, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <h3 style={s.previewSection}>Experience</h3>
              <p style={{ color: "#e8e8f0", fontWeight: 600 }}>{e.role} @ {e.company}</p>
              <p style={{ color: "#44445a", fontSize: 13 }}>{e.duration}</p>
              {e.description && <p style={{ color: "#a0a0b8", fontSize: 14, marginTop: 4 }}>{e.description}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // CV Form
  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <h1 style={s.pageTitle}>📄 Build Your CV Profile</h1>
        <p style={{ color: "#44445a", fontSize: 14 }}>Fill in your details for AI-powered career analysis</p>
      </div>

      <div style={s.form}>
        {/* Personal Info */}
        <div style={s.section}>
          <h3 style={s.sectionTitle}>Personal Information</h3>
          <div style={s.row2}>
            <Field label="Full Name" name="name" value={form.name} onChange={handleField} />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleField} />
          </div>
          <div style={s.row2}>
            <Field label="Phone" name="phone" value={form.phone} onChange={handleField} placeholder="+91 98765 43210" />
            <Field label="Location" name="location" value={form.location} onChange={handleField} placeholder="City, Country" />
          </div>
          <div style={s.row2}>
            <Field label="GitHub Profile" name="github" value={form.github} onChange={handleField} placeholder="https://github.com/username" />
            <Field label="LinkedIn Profile" name="linkedin" value={form.linkedin} onChange={handleField} placeholder="https://linkedin.com/in/username" />
          </div>
          <div style={s.fieldWrap}>
            <label style={s.label}>Professional Summary</label>
            <textarea name="summary" value={form.summary} onChange={handleField}
              placeholder="Brief summary of your background, goals, and key strengths..."
              style={{ ...s.input, minHeight: 100, resize: "vertical" }} />
          </div>
        </div>

        {/* Skills */}
        <div style={s.section}>
          <h3 style={s.sectionTitle}>Skills</h3>
          <div style={s.skillInputRow}>
            <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
              placeholder="Type a skill and press Enter or click Add"
              style={{ ...s.input, flex: 1 }}
              onKeyDown={e => e.key === "Enter" && addSkill(skillInput.trim())} />
            <button onClick={() => addSkill(skillInput.trim())} style={s.addSkillBtn}>+ Add</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {form.skills.map(sk => (
              <span key={sk} style={s.skillChip}>
                {sk} <span onClick={() => removeSkill(sk)} style={{ cursor: "pointer", marginLeft: 4, opacity: 0.5 }}>✕</span>
              </span>
            ))}
          </div>
          <div>
            <p style={{ color: "#33334a", fontSize: 12, marginBottom: 8 }}>Quick add for {CAREERS[career].label}:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SKILL_SUGGESTIONS[career].filter(s => !form.skills.includes(s)).slice(0, 12).map(s => (
                <span key={s} onClick={() => addSkill(s)} style={s2.suggestion}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Experience */}
        <div style={s.section}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ ...s.sectionTitle, marginBottom: 0 }}>Work Experience</h3>
            <button onClick={() => setForm({ ...form, experience: [...form.experience, { company: "", role: "", duration: "", description: "" }] })} style={s.addBtn}>+ Add</button>
          </div>
          {form.experience.map((exp, i) => (
            <div key={i} style={s.expBlock}>
              <div style={s.row2}>
                <Field label="Company" value={exp.company} onChange={e => updateExp(i, "company", e.target.value)} placeholder="Company Name" />
                <Field label="Role / Title" value={exp.role} onChange={e => updateExp(i, "role", e.target.value)} placeholder="e.g. Software Engineer" />
              </div>
              <Field label="Duration" value={exp.duration} onChange={e => updateExp(i, "duration", e.target.value)} placeholder="Jan 2023 – Present" />
              <div style={s.fieldWrap}>
                <label style={s.label}>Description</label>
                <textarea value={exp.description} onChange={e => updateExp(i, "description", e.target.value)}
                  placeholder="Key responsibilities and achievements..."
                  style={{ ...s.input, minHeight: 80, resize: "vertical" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Education */}
        <div style={s.section}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ ...s.sectionTitle, marginBottom: 0 }}>Education</h3>
            <button onClick={() => setForm({ ...form, education: [...form.education, { institution: "", degree: "", year: "" }] })} style={s.addBtn}>+ Add</button>
          </div>
          {form.education.map((edu, i) => (
            <div key={i} style={s.expBlock}>
              <div style={s.row2}>
                <Field label="Institution" value={edu.institution} onChange={e => updateEdu(i, "institution", e.target.value)} placeholder="University / College" />
                <Field label="Degree" value={edu.degree} onChange={e => updateEdu(i, "degree", e.target.value)} placeholder="B.Tech, BSc, MBA..." />
              </div>
              <Field label="Year" value={edu.year} onChange={e => updateEdu(i, "year", e.target.value)} placeholder="2019–2023" />
            </div>
          ))}
        </div>

        <button onClick={saveAndAnalyze} style={s.saveBtn}>
          🤖 Save & Analyze with AI →
        </button>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div style={s.fieldWrap}>
      {label && <label style={s.label}>{label}</label>}
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} style={s.input} />
    </div>
  );
}

const s = {
  page: { padding: "40px 48px", maxWidth: 1000, margin: "0 auto" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 16 },
  pageTitle: { fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: "#fff" },
  backBtn: { padding: "9px 18px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#a0a0b8", borderRadius: 10, cursor: "pointer", fontSize: 13 },
  nextBtn: { padding: "11px 24px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 700 },
  editBtn: { padding: "11px 24px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 700 },
  form: { display: "flex", flexDirection: "column", gap: 8 },
  section: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 28, marginBottom: 20 },
  sectionTitle: { fontFamily: "'Syne',sans-serif", color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 20 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 0 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 },
  label: { color: "#33334a", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 },
  input: { padding: "12px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, color: "#e8e8f0", fontSize: 14, outline: "none", fontFamily: "inherit" },
  skillInputRow: { display: "flex", gap: 10, marginBottom: 12 },
  addSkillBtn: { padding: "12px 20px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", color: "#a5b4fc", borderRadius: 12, cursor: "pointer", fontSize: 13, fontWeight: 700, flexShrink: 0 },
  skillChip: { padding: "5px 12px", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 20, color: "#a5b4fc", fontSize: 13 },
  expBlock: { background: "rgba(255,255,255,0.02)", borderRadius: 14, padding: 20, marginBottom: 12, border: "1px solid rgba(255,255,255,0.04)" },
  addBtn: { padding: "8px 16px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700 },
  saveBtn: { padding: "16px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 8 },
  // Analysis
  analysisLoading: { minHeight: "100vh", background: "#060612", display: "flex", alignItems: "center", justifyContent: "center" },
  loadingCard: { textAlign: "center", maxWidth: 440, padding: 48 },
  loadingIcon: { fontSize: 64, marginBottom: 24, animation: "pulse 2s infinite" },
  loadingTitle: { fontFamily: "'Syne',sans-serif", color: "#fff", fontSize: 26, marginBottom: 10 },
  loadingSub: { color: "#44445a", fontSize: 14, marginBottom: 32, lineHeight: 1.6 },
  loadingBar: { height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden", marginBottom: 28 },
  loadingFill: { height: "100%", background: "linear-gradient(90deg,#6366f1,#8b5cf6,#6366f1)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 2 },
  loadingStep: { color: "#33334a", fontSize: 13, marginBottom: 8, animation: "fadeUp 0.5s ease both" },
  // Analysis result
  analysisGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 },
  gaugeCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28, textAlign: "center" },
  matchCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28 },
  insightCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28 },
  cardLabel: { color: "#44445a", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 },
  gauge: { position: "relative", display: "inline-block", marginBottom: 16 },
  gaugeValue: { position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", textAlign: "center" },
  gaugePct: { fontFamily: "'Syne',sans-serif", fontSize: 36, fontWeight: 800, display: "block" },
  gaugeLabel: { color: "#33334a", fontSize: 12 },
  gaugeDesc: { color: "#44445a", fontSize: 13 },
  matchPct: { marginBottom: 20 },
  skillTags: { display: "flex", flexWrap: "wrap", gap: 6 },
  skillGreen: { padding: "4px 10px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 20, color: "#86efac", fontSize: 12 },
  skillRed: { padding: "4px 10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 20, color: "#fca5a5", fontSize: 12 },
  insightRow: { display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#a0a0b8", fontSize: 14 },
  ctaRow: { display: "flex", gap: 14 },
  ctaBtn: { flex: 1, padding: "16px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer" },
  ctaSecondary: { flex: 1, padding: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b8", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer" },
  previewCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32 },
  previewSection: { color: "#44445a", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
};

const s2 = {
  suggestion: { padding: "4px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, color: "#44445a", fontSize: 12, cursor: "pointer" },
};
