/**
 * SkillPath Pro — SQL Database (localStorage-backed)
 *
 * Tables:
 *   users        (id, name, email, password, created_at)
 *   sessions     (id, user_id, career, created_at)
 *   cv_profiles  (id, user_id, name, email, phone, summary, skills[], experience[], education[], uploaded_at)
 *   assessments  (id, user_id, career, score, total, answers{}, completed_at)
 *   progress     (id, user_id, career, topic, completed, updated_at)
 *   planner      (id, user_id, career, day, task, done)
 */

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || fallback); }
  catch { return JSON.parse(fallback); }
};

const DB = {
  users:       load("sp_users",       "[]"),
  sessions:    load("sp_sessions",    "[]"),
  cv_profiles: load("sp_cv",          "[]"),
  assessments: load("sp_assessments", "[]"),
  progress:    load("sp_progress",    "[]"),
  planner:     load("sp_planner",     "[]"),

  save() {
    localStorage.setItem("sp_users",       JSON.stringify(this.users));
    localStorage.setItem("sp_sessions",    JSON.stringify(this.sessions));
    localStorage.setItem("sp_cv",          JSON.stringify(this.cv_profiles));
    localStorage.setItem("sp_assessments", JSON.stringify(this.assessments));
    localStorage.setItem("sp_progress",    JSON.stringify(this.progress));
    localStorage.setItem("sp_planner",     JSON.stringify(this.planner));
  },

  // ── USERS ────────────────────────────────────────────
  insertUser(name, email, password) {
    const user = { id: Date.now(), name, email, password, created_at: new Date().toISOString() };
    this.users.push(user);
    this.save();
    return user;
  },
  loginUser(email, password) {
    return this.users.find(u => u.email === email && u.password === password) || null;
  },
  userExists(email) { return this.users.some(u => u.email === email); },

  // ── SESSIONS ─────────────────────────────────────────
  logSession(userId, career) {
    this.sessions.push({ id: Date.now(), user_id: userId, career, created_at: new Date().toISOString() });
    this.save();
  },
  getSessionCount(userId, career) {
    return this.sessions.filter(s => s.user_id === userId && s.career === career).length;
  },

  // ── CV PROFILES ──────────────────────────────────────
  upsertCV(userId, data) {
    const idx = this.cv_profiles.findIndex(c => c.user_id === userId);
    const record = { ...data, id: idx >= 0 ? this.cv_profiles[idx].id : Date.now(), user_id: userId, uploaded_at: new Date().toISOString() };
    if (idx >= 0) this.cv_profiles[idx] = record;
    else this.cv_profiles.push(record);
    this.save();
    return record;
  },
  getCV(userId) {
    return this.cv_profiles.find(c => c.user_id === userId) || null;
  },

  // ── ASSESSMENTS ──────────────────────────────────────
  saveAssessment(userId, career, score, total, answers) {
    const existing = this.assessments.find(a => a.user_id === userId && a.career === career);
    const record = { id: existing?.id || Date.now(), user_id: userId, career, score, total, answers, completed_at: new Date().toISOString() };
    if (existing) Object.assign(existing, record);
    else this.assessments.push(record);
    this.save();
    return record;
  },
  getAssessment(userId, career) {
    return this.assessments.find(a => a.user_id === userId && a.career === career) || null;
  },
  getAllAssessments(userId) {
    return this.assessments.filter(a => a.user_id === userId);
  },

  // ── PROGRESS ─────────────────────────────────────────
  getProgress(userId, career) {
    return this.progress.filter(p => p.user_id === userId && p.career === career);
  },
  setProgress(userId, career, topic, completed) {
    const idx = this.progress.findIndex(p => p.user_id === userId && p.career === career && p.topic === topic);
    const record = { id: idx >= 0 ? this.progress[idx].id : Date.now(), user_id: userId, career, topic, completed, updated_at: new Date().toISOString() };
    if (idx >= 0) this.progress[idx] = record;
    else this.progress.push(record);
    this.save();
  },

  // ── PLANNER ──────────────────────────────────────────
  getPlanner(userId, career) { return this.planner.filter(p => p.user_id === userId && p.career === career); },
  addPlannerTask(userId, career, day, task) {
    const t = { id: Date.now(), user_id: userId, career, day, task, done: false };
    this.planner.push(t); this.save(); return t;
  },
  togglePlannerTask(id) {
    const t = this.planner.find(p => p.id === id);
    if (t) { t.done = !t.done; this.save(); }
  },
  deletePlannerTask(id) { this.planner = this.planner.filter(p => p.id !== id); this.save(); },
};

export default DB;
