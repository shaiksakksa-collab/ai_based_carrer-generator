import { useState, useEffect, useCallback, useMemo } from "react";
import { ASSESSMENTS, getScoreLabel } from "../data/assessments";
import DB from "../data/db";
import CAREERS from "../data/careers";

export default function AssessmentPage({ career, user, navigate }) {
  const assessment = ASSESSMENTS[career];
  const c = CAREERS[career];
  const existing = DB.getAssessment(user.id, career);

  // --- STATE ---
  const [phase, setPhase] = useState(existing ? "result" : "intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [showExplain, setShowExplain] = useState(false);
  const [timeLeft, setTimeLeft] = useState(assessment.duration * 60);
  const [result, setResult] = useState(existing || null);
  
  // NEW FEATURE: Focus Mode Tracking
  const [tabSwitches, setTabSwitches] = useState(0);

  // --- LOGIC ---
  const submitTest = useCallback(() => {
    const score = assessment.questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
    const saved = DB.saveAssessment(user.id, career, score, assessment.questions.length, answers);
    setResult(saved);
    setPhase("result");
  }, [answers, assessment, career, user.id]);

  // NEW FEATURE: Anti-Cheat Tab Tracking
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && phase === "test") {
        setTabSwitches(p => p + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [phase]);

  useEffect(() => {
    if (phase !== "test") return;
    if (timeLeft <= 0) { submitTest(); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft, submitTest]);

  const startTest = () => {
    setPhase("test");
    setCurrent(0);
    setAnswers({});
    setSelected(null);
    setShowExplain(false);
    setTimeLeft(assessment.duration * 60);
    setTabSwitches(0);
  };

  const selectAnswer = (idx) => {
    if (showExplain) return;
    setSelected(idx);
    setShowExplain(true);
    setAnswers(p => ({ ...p, [current]: idx }));
  };

  const nextQuestion = () => {
    if (current + 1 < assessment.questions.length) {
      setCurrent(p => p + 1);
      setSelected(null);
      setShowExplain(false);
    } else {
      submitTest();
    }
  };

  const progress = ((current + 1) / assessment.questions.length) * 100;
  const currentQ = assessment.questions[current];

  // ── PHASE: INTRO ───────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div style={s.pageWrapper}>
        <div style={s.glassContainer}>
          <div style={s.introHeader}>
            <div style={s.iconCircle}>{c.icon}</div>
            <h1 style={s.title}>{assessment.title}</h1>
            <p style={s.subtitle}>Verification assessment for {c.label} track</p>
          </div>

          <div style={s.statsBar}>
            <div style={s.statBox}>
              <span style={s.statIcon}>⏱</span>
              <div style={s.statText}>
                <span style={s.statVal}>{assessment.duration}m</span>
                <span style={s.statLabel}>Duration</span>
              </div>
            </div>
            <div style={s.statBox}>
              <span style={s.statIcon}>🎯</span>
              <div style={s.statText}>
                <span style={s.statVal}>{assessment.passMark}%</span>
                <span style={s.statLabel}>To Pass</span>
              </div>
            </div>
            <div style={s.statBox}>
              <span style={s.statIcon}>🧠</span>
              <div style={s.statText}>
                <span style={s.statVal}>Expert</span>
                <span style={s.statLabel}>Level</span>
              </div>
            </div>
          </div>

          <div style={s.instructionCard}>
            <h4 style={s.instrTitle}>Exam Instructions:</h4>
            <ul style={s.instrList}>
              <li>Once started, the timer cannot be paused.</li>
              <li>Leaving the tab will be flagged by the Focus Mode monitor.</li>
              <li>You will receive instant feedback after each answer.</li>
            </ul>
          </div>

          <button onClick={startTest} style={{ ...s.primaryBtn, background: c.gradient }}>
            {existing ? "Retake Proficiency Exam" : "Begin Certification Assessment"}
          </button>
          
          <button onClick={() => navigate("home")} style={s.textBtn}>← Return to Dashboard</button>
        </div>
      </div>
    );
  }

  // ── PHASE: TEST ────────────────────────────────────────────────────────────
  if (phase === "test") {
    const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const secs = String(timeLeft % 60).padStart(2, "0");

    return (
      <div style={s.testLayout}>
        {/* Left: Sidebar Navigation */}
        <aside style={s.testSidebar}>
          <div style={s.sideHeader}>
            <span style={s.logoMini}>🎯 SkillPath</span>
            <div style={{...s.timer, color: timeLeft < 60 ? "#ff4d4d" : "#6366f1"}}>
               {mins}:{secs}
            </div>
          </div>
          
          <div style={s.qGrid}>
            {assessment.questions.map((_, i) => (
              <div 
                key={i} 
                style={{
                  ...s.qTab,
                  background: current === i ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
                  borderColor: current === i ? "#6366f1" : "transparent",
                  color: answers[i] !== undefined ? "#10b981" : "#44445a"
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {tabSwitches > 0 && (
            <div style={s.warningBox}>
              ⚠️ Focus Warning: {tabSwitches} exit(s) detected.
            </div>
          )}
        </aside>

        {/* Right: Question Area */}
        <main style={s.mainContent}>
          <div style={s.topProgress}>
            <div style={{ ...s.progressInner, width: `${progress}%`, background: c.gradient }} />
          </div>

          <div style={s.questionCard}>
            <div style={s.qHeader}>
              <span style={s.qCat}>{c.label} Specialization</span>
              <span style={s.qDiff}>{currentQ.difficulty}</span>
            </div>
            
            <h2 style={s.qText}>{currentQ.question}</h2>

            <div style={s.optionsGrid}>
              {currentQ.options.map((opt, i) => {
                let state = "default";
                if (showExplain) {
                  if (i === currentQ.correct) state = "correct";
                  else if (i === selected) state = "wrong";
                  else state = "dim";
                } else if (selected === i) state = "selected";

                return (
                  <div 
                    key={i} 
                    style={{ ...s.optItem, ...s.optStates[state] }}
                    onClick={() => selectAnswer(i)}
                  >
                    <span style={s.optIndex}>{String.fromCharCode(65 + i)}</span>
                    <span style={s.optValue}>{opt}</span>
                    {state === "correct" && <span style={s.check}>✓</span>}
                  </div>
                );
              })}
            </div>

            {showExplain && (
              <div style={s.liveFeedback}>
                <div style={s.feedbackHeader}>
                  {selected === currentQ.correct ? "✅ Knowledge Confirmed" : "❌ Learning Opportunity"}
                </div>
                <p style={s.feedbackText}>{currentQ.explanation}</p>
                <button onClick={nextQuestion} style={{ ...s.nextBtn, background: c.gradient }}>
                  {current === assessment.questions.length - 1 ? "Finish Exam" : "Next Question"}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ── PHASE: RESULT ──────────────────────────────────────────────────────────
  if (phase === "result" && result) {
    const pct = Math.round((result.score / result.total) * 100);
    const label = getScoreLabel(pct);
    const passed = pct >= assessment.passMark;

    return (
      <div style={s.pageWrapper}>
        <div style={s.resultContainer}>
          <div style={s.confettiZone}>🎊</div>
          <h1 style={{ ...s.resTitle, color: label.color }}>{label.label}</h1>
          <div style={s.scoreCircle}>
            <span style={s.resBigPct}>{pct}%</span>
            <span style={s.resCount}>{result.score} / {result.total}</span>
          </div>

          <div style={s.resultGrid}>
             <div style={s.resItem}>
                <span style={s.resLab}>Status</span>
                <span style={{ color: passed ? "#10b981" : "#ef4444", fontWeight: 700 }}>
                  {passed ? "CERTIFIED" : "NOT PASSED"}
                </span>
             </div>
             <div style={s.resItem}>
                <span style={s.resLab}>Accuracy</span>
                <span>{Math.round((result.score / result.total) * 100)}%</span>
             </div>
             <div style={s.resItem}>
                <span style={s.resLab}>Focus Score</span>
                <span style={{ color: tabSwitches > 0 ? "#f59e0b" : "#10b981" }}>
                  {tabSwitches === 0 ? "Perfect" : "High Risk"}
                </span>
             </div>
          </div>

          <div style={s.actionRow}>
            <button onClick={() => navigate("roadmap", career)} style={{ ...s.primaryBtn, background: c.gradient }}>
              Explore Roadmap
            </button>
            <button onClick={startTest} style={s.secondaryBtn}>
              Retake Assessment
            </button>
          </div>
          
          <button onClick={() => navigate("home")} style={s.textBtn}>Back to Home</button>
        </div>
      </div>
    );
  }

  return null;
}

const s = {
  pageWrapper: { minHeight: "100vh", background: "#020205", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" },
  glassContainer: { background: "#0a0a0f", border: "1px solid #1a1a24", borderRadius: "32px", padding: "60px", maxWidth: "600px", width: "100%", textAlign: "center" },
  
  // Intro Components
  iconCircle: { width: "100px", height: "100px", background: "rgba(255,255,255,0.03)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "50px", margin: "0 auto 24px" },
  title: { fontSize: "32px", fontWeight: 800, marginBottom: "8px", color: "#fff" },
  subtitle: { color: "#64748b", fontSize: "16px", marginBottom: "40px" },
  statsBar: { display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "24px", borderRadius: "20px", marginBottom: "32px" },
  statBox: { display: "flex", alignItems: "center", gap: "10px" },
  statIcon: { fontSize: "20px" },
  statText: { display: "flex", flexDirection: "column", alignItems: "flex-start" },
  statVal: { fontWeight: 700, color: "#fff" },
  statLabel: { fontSize: "11px", color: "#64748b", textTransform: "uppercase" },
  instructionCard: { textAlign: "left", padding: "20px", background: "rgba(239, 68, 68, 0.05)", borderRadius: "16px", marginBottom: "40px" },
  instrTitle: { fontSize: "14px", fontWeight: 700, color: "#ff4d4d", marginBottom: "10px" },
  instrList: { fontSize: "13px", color: "#94a3b8", paddingLeft: "20px", lineHeight: "1.8" },

  // Test Layout
  testLayout: { display: "flex", height: "100vh", background: "#020205" },
  testSidebar: { width: "280px", borderRight: "1px solid #1a1a24", padding: "30px", display: "flex", flexDirection: "column", gap: "30px" },
  sideHeader: { display: "flex", flexDirection: "column", gap: "12px" },
  logoMini: { fontSize: "18px", fontWeight: 800, color: "#6366f1" },
  timer: { fontSize: "32px", fontWeight: 800, fontFamily: "monospace" },
  qGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" },
  qTab: { height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", border: "1px solid transparent", fontSize: "13px", fontWeight: 600 },
  warningBox: { marginTop: "auto", padding: "12px", background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", fontSize: "12px", borderRadius: "8px", border: "1px solid rgba(245,158,11,0.2)" },

  mainContent: { flex: 1, padding: "60px", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" },
  topProgress: { width: "100%", maxWidth: "800px", height: "6px", background: "#111", borderRadius: "10px", marginBottom: "60px", overflow: "hidden" },
  progressInner: { height: "100%", transition: "width 0.4s ease" },
  questionCard: { width: "100%", maxWidth: "800px" },
  qHeader: { display: "flex", justifyContent: "space-between", marginBottom: "16px" },
  qCat: { fontSize: "12px", color: "#6366f1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" },
  qDiff: { fontSize: "11px", padding: "4px 8px", background: "#111", borderRadius: "4px", color: "#64748b" },
  qText: { fontSize: "28px", fontWeight: 700, lineHeight: 1.4, marginBottom: "40px", color: "#fff" },
  
  optionsGrid: { display: "flex", flexDirection: "column", gap: "12px" },
  optItem: { display: "flex", alignItems: "center", gap: "20px", padding: "20px 24px", borderRadius: "16px", cursor: "pointer", transition: "all 0.2s", border: "1px solid #1a1a24" },
  optIndex: { width: "32px", height: "32px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700 },
  optValue: { fontSize: "16px", fontWeight: 500 },
  check: { marginLeft: "auto", color: "#10b981", fontWeight: 800 },

  optStates: {
    default: { background: "#0a0a0f", color: "#94a3b8" },
    selected: { background: "rgba(99,102,241,0.1)", borderColor: "#6366f1", color: "#fff" },
    correct: { background: "rgba(16, 185, 129, 0.1)", borderColor: "#10b981", color: "#10b981" },
    wrong: { background: "rgba(239, 68, 68, 0.1)", borderColor: "#ef4444", color: "#ef4444" },
    dim: { opacity: 0.3, cursor: "default" }
  },

  liveFeedback: { marginTop: "40px", padding: "30px", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px solid #1a1a24", animation: "slideUp 0.3s ease" },
  feedbackHeader: { fontWeight: 800, marginBottom: "10px", fontSize: "18px" },
  feedbackText: { color: "#94a3b8", lineHeight: 1.6, fontSize: "15px", marginBottom: "24px" },

  // Result Components
  resultContainer: { background: "#0a0a0f", border: "1px solid #1a1a24", borderRadius: "32px", padding: "60px", maxWidth: "500px", width: "100%", textAlign: "center", position: "relative" },
  resTitle: { fontSize: "36px", fontWeight: 900, marginBottom: "30px" },
  scoreCircle: { width: "180px", height: "180px", borderRadius: "50%", border: "8px solid #1a1a24", margin: "0 auto 40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  resBigPct: { fontSize: "48px", fontWeight: 900, color: "#fff" },
  resCount: { fontSize: "14px", color: "#64748b" },
  resultGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "40px" },
  resItem: { padding: "15px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" },
  resLab: { color: "#64748b", fontSize: "10px", textTransform: "uppercase" },

  // Buttons
  primaryBtn: { width: "100%", padding: "18px", border: "none", borderRadius: "14px", color: "#fff", fontSize: "16px", fontWeight: 700, cursor: "pointer", marginBottom: "12px" },
  secondaryBtn: { width: "100%", padding: "18px", background: "#111", border: "1px solid #222", color: "#fff", borderRadius: "14px", fontWeight: 600, cursor: "pointer" },
  textBtn: { background: "none", border: "none", color: "#64748b", cursor: "pointer", marginTop: "20px", fontSize: "14px" },
  nextBtn: { padding: "14px 30px", border: "none", borderRadius: "10px", color: "#fff", fontWeight: 700, cursor: "pointer" }
};