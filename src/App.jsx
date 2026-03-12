import { useState, useEffect } from "react";

const API = "http://localhost:8080";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080c14;
    --surface: #0e1420;
    --surface2: #151d2e;
    --surface3: #1a2438;
    --border: #1e2d45;
    --border2: #243450;
    --accent: #00e5c3;
    --accent2: #4f8ef7;
    --accent3: #f97316;
    --danger: #ef4444;
    --warn: #f59e0b;
    --text: #e2e8f0;
    --muted: #5a7090;
    --muted2: #7a90b0;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  h1,h2,h3,h4,h5 { font-family: 'Syne', sans-serif; }

  /* ── Auth ── */
  .auth-wrap { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
  .auth-left {
    background: var(--surface);
    display: flex; flex-direction: column; justify-content: center; padding: 60px;
    position: relative; overflow: hidden;
  }
  .auth-left::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 20% 50%, rgba(0,229,195,0.08) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(79,142,247,0.08) 0%, transparent 50%);
  }
  .auth-grid {
    position: absolute; inset: 0; opacity: 0.03;
    background-image: linear-gradient(var(--border) 1px, transparent 1px),
                      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .auth-left-content { position: relative; z-index: 1; }
  .brand { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800;
    color: var(--accent); letter-spacing: -0.02em; margin-bottom: 48px; }
  .auth-tagline { font-size: 3rem; font-weight: 800; line-height: 1.1; color: #fff;
    letter-spacing: -0.03em; margin-bottom: 20px; }
  .auth-tagline .highlight { color: var(--accent); }
  .auth-desc { color: var(--muted2); font-size: 1rem; line-height: 1.7; max-width: 360px; margin-bottom: 48px; }
  .feature-list { display: flex; flex-direction: column; gap: 12px; }
  .feature-item { display: flex; align-items: center; gap: 12px; color: var(--muted2); font-size: 0.9rem; }
  .feature-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }

  .auth-right { background: var(--bg); display: flex; align-items: center; justify-content: center; padding: 60px 40px; }
  .auth-card { width: 100%; max-width: 400px; }
  .auth-title { font-size: 1.8rem; font-weight: 700; margin-bottom: 6px; letter-spacing: -0.02em; }
  .auth-sub { color: var(--muted); font-size: 0.9rem; margin-bottom: 32px; }
  .tab-row { display: flex; background: var(--surface); border-radius: 10px; padding: 4px; margin-bottom: 28px; border: 1px solid var(--border); }
  .tab-btn { flex: 1; padding: 10px; border: none; background: transparent; color: var(--muted);
    border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500; transition: all 0.2s; }
  .tab-btn.active { background: var(--accent); color: #000; font-weight: 600; }

  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 0.82rem; color: var(--muted2); margin-bottom: 6px; font-weight: 500; letter-spacing: 0.02em; }
  .form-input { width: 100%; padding: 11px 14px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.93rem;
    transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
  .form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,229,195,0.1); }
  .form-select { width: 100%; padding: 11px 14px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.93rem; outline: none; cursor: pointer; }
  .form-select:focus { border-color: var(--accent); }
  textarea.form-input { resize: vertical; }

  .btn-primary { width: 100%; padding: 13px; background: var(--accent); border: none; border-radius: 8px;
    color: #000; font-weight: 700; font-size: 0.95rem; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: opacity 0.2s, transform 0.1s; letter-spacing: 0.01em; }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .error-msg { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25);
    color: #fca5a5; padding: 11px 14px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 16px; }
  .success-msg { background: rgba(0,229,195,0.08); border: 1px solid rgba(0,229,195,0.25);
    color: var(--accent); padding: 11px 14px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 16px; }

  /* ── Navbar ── */
  .navbar { background: var(--surface); border-bottom: 1px solid var(--border);
    padding: 0 28px; height: 60px; display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 100; }
  .nav-brand { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800; color: var(--accent); letter-spacing: -0.02em; }
  .nav-links { display: flex; gap: 2px; }
  .nav-link { padding: 7px 14px; border-radius: 7px; border: none; background: transparent;
    color: var(--muted); cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
    font-weight: 500; transition: all 0.2s; }
  .nav-link:hover { background: var(--surface2); color: var(--text); }
  .nav-link.active { background: var(--surface2); color: var(--accent); }
  .nav-right { display: flex; align-items: center; gap: 10px; }
  .role-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.73rem; font-weight: 700;
    letter-spacing: 0.05em; text-transform: uppercase; }
  .role-badge.candidate { background: rgba(0,229,195,0.1); color: var(--accent); border: 1px solid rgba(0,229,195,0.25); }
  .role-badge.recruiter { background: rgba(79,142,247,0.1); color: var(--accent2); border: 1px solid rgba(79,142,247,0.25); }
  .btn-logout { padding: 7px 14px; border-radius: 7px; border: 1px solid var(--border);
    background: transparent; color: var(--muted); cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; transition: all 0.2s; }
  .btn-logout:hover { border-color: var(--danger); color: var(--danger); }

  /* ── Page ── */
  .page { padding: 28px 32px; max-width: 1200px; margin: 0 auto; }
  .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
  .page-title { font-size: 1.8rem; font-weight: 700; letter-spacing: -0.02em; }
  .page-sub { color: var(--muted2); margin-top: 4px; font-size: 0.9rem; }

  /* ── Cards ── */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px; }
  .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px; }

  /* ── Stats ── */
  .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; margin-bottom: 28px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; }
  .stat-num { font-size: 1.9rem; font-weight: 700; font-family: 'Syne', sans-serif; color: var(--accent); }
  .stat-label { color: var(--muted2); font-size: 0.82rem; margin-top: 3px; }

  /* ── Job Card ── */
  .job-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px;
    transition: border-color 0.2s, transform 0.2s; }
  .job-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .job-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .job-title-text { font-size: 1.05rem; font-weight: 600; font-family: 'Syne', sans-serif; }
  .job-actions { display: flex; gap: 6px; }
  .btn-icon { padding: 6px 10px; border-radius: 7px; border: 1px solid var(--border); background: transparent;
    cursor: pointer; font-size: 0.8rem; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .btn-edit { color: var(--accent2); border-color: rgba(79,142,247,0.3); }
  .btn-edit:hover { background: rgba(79,142,247,0.1); }
  .btn-delete { color: var(--danger); border-color: rgba(239,68,68,0.3); }
  .btn-delete:hover { background: rgba(239,68,68,0.08); }
  .job-recruiter { color: var(--muted); font-size: 0.83rem; margin-bottom: 10px; }
  .job-desc { color: #94a3b8; font-size: 0.88rem; line-height: 1.6; margin-bottom: 14px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .job-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
  .meta-chip { padding: 3px 10px; border-radius: 20px; font-size: 0.76rem; font-weight: 500; }
  .meta-chip.exp { background: rgba(79,142,247,0.08); border: 1px solid rgba(79,142,247,0.2); color: #93c5fd; }
  .skills-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; }
  .skill-tag { padding: 3px 9px; border-radius: 5px; font-size: 0.74rem;
    background: rgba(0,229,195,0.06); border: 1px solid rgba(0,229,195,0.18); color: var(--accent); }

  .btn-apply { width: 100%; padding: 10px; background: var(--accent); border: none; border-radius: 8px;
    color: #000; font-weight: 700; font-size: 0.88rem; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: opacity 0.2s; }
  .btn-apply:hover { opacity: 0.85; }
  .btn-apply:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-applied { background: var(--surface2) !important; color: var(--muted) !important; border: 1px solid var(--border); cursor: default !important; opacity: 1 !important; }

  /* ── Applications ── */
  .app-table { width: 100%; border-collapse: collapse; }
  .app-table th { text-align: left; padding: 10px 16px; color: var(--muted); font-size: 0.78rem;
    text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid var(--border); font-weight: 600; }
  .app-table td { padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
  .app-table tr:last-child td { border-bottom: none; }
  .app-table tr:hover td { background: var(--surface2); }

  .score-badge { padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.82rem; display: inline-block; }
  .score-high { background: rgba(0,229,195,0.12); color: var(--accent); border: 1px solid rgba(0,229,195,0.25); }
  .score-mid { background: rgba(245,158,11,0.12); color: #fbbf24; border: 1px solid rgba(245,158,11,0.25); }
  .score-low { background: rgba(239,68,68,0.08); color: #fca5a5; border: 1px solid rgba(239,68,68,0.2); }

  /* ── Recruiter Job List ── */
  .recruiter-job-item { padding: 18px 20px; border-bottom: 1px solid var(--border); transition: background 0.15s; }
  .recruiter-job-item:last-child { border-bottom: none; }
  .recruiter-job-item:hover { background: var(--surface2); }
  .rji-header { display: flex; justify-content: space-between; align-items: center; }
  .rji-title { font-weight: 600; font-family: 'Syne', sans-serif; font-size: 1rem; }
  .rji-meta { color: var(--muted); font-size: 0.83rem; margin-top: 4px; }
  .rji-actions { display: flex; gap: 8px; align-items: center; }
  .view-apps-btn { padding: 6px 14px; border-radius: 7px; border: 1px solid rgba(0,229,195,0.3);
    background: rgba(0,229,195,0.06); color: var(--accent); cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600; transition: all 0.2s; }
  .view-apps-btn:hover { background: rgba(0,229,195,0.12); }

  /* ── Modal ── */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200;
    display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
    padding: 28px; width: 100%; max-width: 500px; max-height: 85vh; overflow-y: auto; }
  .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .modal-title { font-size: 1.2rem; font-weight: 700; font-family: 'Syne', sans-serif; }
  .modal-close { border: none; background: transparent; color: var(--muted); cursor: pointer;
    font-size: 1.4rem; line-height: 1; padding: 4px; transition: color 0.2s; }
  .modal-close:hover { color: var(--text); }
  .modal-footer { display: flex; gap: 10px; margin-top: 24px; justify-content: flex-end; }
  .btn-cancel { padding: 10px 20px; border-radius: 8px; border: 1px solid var(--border);
    background: transparent; color: var(--muted); cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; transition: all 0.2s; }
  .btn-cancel:hover { border-color: var(--border2); color: var(--text); }
  .btn-save { padding: 10px 24px; border-radius: 8px; background: var(--accent); border: none;
    color: #000; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; transition: opacity 0.2s; }
  .btn-save:hover { opacity: 0.85; }
  .btn-save:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-danger-solid { padding: 10px 20px; border-radius: 8px; background: var(--danger); border: none;
    color: #fff; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; }

  /* ── Applicants Panel ── */
  .applicants-panel { background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-top: 16px; }
  .applicants-panel-title { font-size: 0.9rem; font-weight: 600; color: var(--muted2); margin-bottom: 16px;
    text-transform: uppercase; letter-spacing: 0.06em; font-family: 'Syne', sans-serif; }
  .applicant-row { display: flex; align-items: center; justify-content: space-between;
    padding: 12px 0; border-bottom: 1px solid var(--border); }
  .applicant-row:last-child { border-bottom: none; }
  .applicant-name { font-weight: 600; font-size: 0.92rem; }
  .applicant-email { color: var(--muted); font-size: 0.82rem; margin-top: 2px; }
  .applicant-exp { color: var(--muted2); font-size: 0.82rem; }

  /* ── Profile ── */
  .pdf-upload-box { border: 2px dashed var(--border2); border-radius: 10px; padding: 28px;
    text-align: center; cursor: pointer; background: var(--surface2); transition: border-color 0.2s; }
  .pdf-upload-box:hover { border-color: var(--accent); }
  .pdf-icon { font-size: 2.2rem; margin-bottom: 10px; }
  .pdf-upload-text { color: var(--text); font-weight: 500; font-size: 0.92rem; }
  .pdf-upload-sub { color: var(--muted); font-size: 0.8rem; margin-top: 4px; }

  /* ── Action Buttons ── */
  .btn-action { padding: 10px 22px; border-radius: 8px; background: var(--accent); border: none;
    color: #000; font-weight: 700; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    cursor: pointer; transition: opacity 0.2s; }
  .btn-action:hover { opacity: 0.85; }
  .btn-action:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Empty ── */
  .empty-state { text-align: center; padding: 50px 20px; color: var(--muted); }
  .empty-icon { font-size: 2.8rem; margin-bottom: 14px; }
  .empty-title { font-size: 1rem; font-weight: 600; color: var(--text); margin-bottom: 6px; font-family: 'Syne', sans-serif; }

  /* ── Spinner ── */
  .spinner { width: 32px; height: 32px; border: 3px solid var(--border);
    border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; margin: 50px auto; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .divider { height: 1px; background: var(--border); margin: 20px 0; }

  @media (max-width: 768px) {
    .auth-wrap { grid-template-columns: 1fr; }
    .auth-left { display: none; }
    .page { padding: 16px; }
  }
`;

// ── API ───────────────────────────────────────────────────────────────────────
const api = {
  post: async (path, body, token) => {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(data.error || data.message || "Something went wrong");
    return data;
  },
  put: async (path, body, token) => {
    const res = await fetch(`${API}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(data.error || data.message || "Something went wrong");
    return data;
  },
  delete: async (path, token) => {
    const res = await fetch(`${API}${path}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Delete failed");
    return true;
  },
  get: async (path, token) => {
    const res = await fetch(`${API}${path}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data;
  },
};

// ── Auth ──────────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CANDIDATE" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      if (tab === "register") {
        await api.post("/auth/register", form);
        setSuccess("Registered successfully! Please login.");
        setTab("login");
      } else {
        const data = await api.post("/auth/login", { email: form.email, password: form.password });
        onLogin(data.token, data.role, data.name);
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-grid" />
        <div className="auth-left-content">
          <div className="brand">⚡ ResumeMatcher</div>
          <div className="auth-tagline">Smart hiring,<br /><span className="highlight">zero guesswork</span></div>
          <p className="auth-desc">AI-powered resume screening that matches top talent with the right opportunities. Save time. Make better decisions.</p>
          <div className="feature-list">
            {["AI-powered skill matching algorithm","Real-time match score calculation","PDF resume parsing & analysis","Role-based access for recruiters & candidates"].map(f => (
              <div className="feature-item" key={f}><div className="feature-dot" />{f}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-title">{tab === "login" ? "Welcome back" : "Create account"}</div>
          <div className="auth-sub">{tab === "login" ? "Sign in to your account" : "Join thousands of users"}</div>
          <div className="tab-row">
            <button className={`tab-btn ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Login</button>
            <button className={`tab-btn ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>Register</button>
          </div>
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}
          {tab === "register" && <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="Your name" value={form.name} onChange={set("name")} /></div>}
          <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} /></div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} /></div>
          {tab === "register" && (
            <div className="form-group">
              <label className="form-label">I am a...</label>
              <select className="form-select" value={form.role} onChange={set("role")}>
                <option value="CANDIDATE">Job Seeker (Candidate)</option>
                <option value="RECRUITER">Recruiter / HR</option>
              </select>
            </div>
          )}
          <button className="btn-primary" onClick={submit} disabled={loading}>{loading ? "Please wait..." : tab === "login" ? "Sign In →" : "Create Account →"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ role, page, setPage, onLogout }) {
  const links = role === "CANDIDATE"
    ? [{ id: "jobs", label: "Browse Jobs" }, { id: "applications", label: "My Applications" }, { id: "profile", label: "My Profile" }]
    : [{ id: "rec-jobs", label: "My Jobs" }, { id: "post", label: "Post Job" }, { id: "all-applicants", label: "All Applicants" }];

  return (
    <nav className="navbar">
      <div className="nav-brand">⚡ ResumeMatcher</div>
      <div className="nav-links">
        {links.map(l => <button key={l.id} className={`nav-link ${page === l.id ? "active" : ""}`} onClick={() => setPage(l.id)}>{l.label}</button>)}
      </div>
      <div className="nav-right">
        <span className={`role-badge ${role.toLowerCase()}`}>{role}</span>
        <button className="btn-logout" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

// ── Jobs Page (Candidate) ─────────────────────────────────────────────────────
function JobsPage({ token }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [applied, setApplied] = useState(new Set());
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => { api.get("/jobs", token).then(setJobs).catch(console.error).finally(() => setLoading(false)); }, [token]);

  const apply = async (jobId) => {
    setApplying(jobId); setMsg({ text: "", type: "" });
    try {
      await api.post(`/applications/apply?jobId=${jobId}`, {}, token);
      setApplied(s => new Set([...s, jobId]));
      setMsg({ text: "Applied successfully! 🎉", type: "success" });
    } catch (e) { setMsg({ text: e.message, type: "error" }); }
    setApplying(null);
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div><div className="page-title">Browse Jobs</div><div className="page-sub">{jobs.length} opportunities available</div></div>
      </div>
      {msg.text && <div className={msg.type === "success" ? "success-msg" : "error-msg"} style={{marginBottom: 20}}>{msg.text}</div>}
      {jobs.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">💼</div><div className="empty-title">No jobs posted yet</div><p>Check back soon!</p></div>
      ) : (
        <div className="card-grid">
          {jobs.map(job => (
            <div className="job-card" key={job.id}>
              <div className="job-card-header">
                <div className="job-title-text">{job.title}</div>
              </div>
              <div className="job-recruiter">Posted by {job.recruiter?.name || "Recruiter"}</div>
              <div className="job-desc">{job.description}</div>
              <div className="job-meta">
                <span className="meta-chip exp">🎯 {job.requiredExperience}+ yrs exp</span>
              </div>
              {job.skills?.length > 0 && <div className="skills-row">{job.skills.map(s => <span className="skill-tag" key={s.id || s.name}>{s.name}</span>)}</div>}
              <button className={`btn-apply ${applied.has(job.id) ? "btn-applied" : ""}`}
                onClick={() => !applied.has(job.id) && apply(job.id)}
                disabled={applying === job.id || applied.has(job.id)}>
                {applying === job.id ? "Applying..." : applied.has(job.id) ? "✓ Applied" : "Apply Now"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── My Applications ───────────────────────────────────────────────────────────
function ApplicationsPage({ token }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/applications/my", token).then(setApps).catch(console.error).finally(() => setLoading(false)); }, [token]);
  const scoreClass = s => s >= 70 ? "score-high" : s >= 40 ? "score-mid" : "score-low";

  if (loading) return <div className="page"><div className="spinner" /></div>;
  return (
    <div className="page">
      <div className="page-header"><div><div className="page-title">My Applications</div><div className="page-sub">Track all your job applications</div></div></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-num">{apps.length}</div><div className="stat-label">Total Applied</div></div>
        <div className="stat-card"><div className="stat-num">{apps.filter(a => (a.matchScore||0) >= 70).length}</div><div className="stat-label">Strong Matches</div></div>
        <div className="stat-card"><div className="stat-num">{apps.length ? Math.round(apps.reduce((s,a) => s+(a.matchScore||0),0)/apps.length) : 0}%</div><div className="stat-label">Avg Match Score</div></div>
      </div>
      <div className="card">
        {apps.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No applications yet</div><p>Browse jobs and apply!</p></div>
        ) : (
          <table className="app-table">
            <thead><tr><th>Job Title</th><th>Applied On</th><th>Match Score</th></tr></thead>
            <tbody>
              {apps.map(app => (
                <tr key={app.id}>
                  <td style={{fontWeight: 600}}>{app.job?.title || "Job"}</td>
                  <td style={{color: "var(--muted)"}}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td><span className={`score-badge ${scoreClass(app.matchScore||0)}`}>{Math.round(app.matchScore||0)}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Profile Page ──────────────────────────────────────────────────────────────
function ProfilePage({ token }) {
  const [form, setForm] = useState({ education: "", experience: "", resumeText: "", skillNames: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/candidate/profile", token)
      .then(p => setForm({ education: p.education||"", experience: p.experience||"", resumeText: p.resumeText||"", skillNames: Array.isArray(p.skills) ? p.skills.map(s=>s.name).join(", ") : "" }))
      .catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true); setMsg("");
    try {
      const skillsStr = Array.isArray(form.skillNames) ? form.skillNames.join(", ") : form.skillNames;
      const raw = skillsStr.split(",").map(s => s.trim()).filter(Boolean);
      const unique = raw.filter((s,i) => raw.findIndex(x => x.toLowerCase()===s.toLowerCase())===i);
      await api.post("/candidate/profile", { education: form.education, experience: parseInt(form.experience)||0, resumeText: form.resumeText, skillNames: unique }, token);
      setMsg("Profile saved! ✅");
    } catch (e) { setMsg(e.message); }
    setSaving(false);
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header"><div><div className="page-title">My Profile</div><div className="page-sub">Keep updated for better match scores</div></div></div>
      <div className="card" style={{maxWidth: 600}}>
        {msg && <div className="success-msg" style={{marginBottom: 20}}>{msg}</div>}
        <div className="form-group"><label className="form-label">Education</label><input className="form-input" placeholder="e.g. B.Tech Computer Science" value={form.education} onChange={set("education")} /></div>
        <div className="form-group"><label className="form-label">Years of Experience</label><input className="form-input" type="number" placeholder="e.g. 2" value={form.experience} onChange={set("experience")} /></div>
        <div className="form-group"><label className="form-label">Skills (comma separated)</label><input className="form-input" placeholder="e.g. Java, Spring Boot, MySQL" value={form.skillNames} onChange={set("skillNames")} /></div>
        <div className="form-group">
          <label className="form-label">Upload Resume (PDF)</label>
          <div className="pdf-upload-box" onClick={() => document.getElementById("resumeUpload").click()}>
            <input id="resumeUpload" type="file" accept=".pdf" style={{display:"none"}} onChange={async e => {
              const file = e.target.files[0]; if (!file) return;
              setMsg("Reading PDF...");
              if (!window.pdfjsLib) {
                await new Promise((res, rej) => { const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
                window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
              }
              const reader = new FileReader();
              reader.onload = async ev => {
                try {
                  const pdf = await window.pdfjsLib.getDocument({data: ev.target.result}).promise;
                  let text = "";
                  for (let i=1; i<=pdf.numPages; i++) { const page=await pdf.getPage(i); const c=await page.getTextContent(); text+=c.items.map(x=>x.str).join(" ")+"\n"; }
                  setForm(f => ({...f, resumeText: text}));
                  setMsg(`✅ PDF loaded: ${file.name}`);
                } catch { setMsg("Failed to read PDF."); }
              };
              reader.readAsArrayBuffer(file);
            }} />
            <div className="pdf-icon">📄</div>
            <div className="pdf-upload-text">{form.resumeText ? "✅ Resume loaded! Click to change" : "Click to upload PDF resume"}</div>
            <div className="pdf-upload-sub">PDF files only</div>
          </div>
        </div>
        <button className="btn-action" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Profile"}</button>
      </div>
    </div>
  );
}

// ── Recruiter: My Jobs (with Edit/Delete + View Applicants) ───────────────────
function RecruiterJobsPage({ token }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [applicants, setApplicants] = useState({});
  const [loadingApps, setLoadingApps] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [deleteJob, setDeleteJob] = useState(null);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const loadJobs = () => api.get("/jobs/my", token).then(setJobs).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { loadJobs(); }, [token]);

  const toggleApplicants = async (jobId) => {
    if (expandedJob === jobId) { setExpandedJob(null); return; }
    setExpandedJob(jobId);
    if (!applicants[jobId]) {
      setLoadingApps(jobId);
      try { const apps = await api.get(`/applications/job/${jobId}`, token); setApplicants(a => ({...a, [jobId]: apps})); }
      catch { setApplicants(a => ({...a, [jobId]: []})); }
      setLoadingApps(null);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/jobs/delete/${deleteJob.id}`, token);
      setJobs(j => j.filter(x => x.id !== deleteJob.id));
      setDeleteJob(null);
      setMsg({ text: "Job deleted successfully!", type: "success" });
    } catch (e) { setMsg({ text: e.message, type: "error" }); setDeleteJob(null); }
  };

  const scoreClass = s => s >= 70 ? "score-high" : s >= 40 ? "score-mid" : "score-low";

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div><div className="page-title">My Jobs</div><div className="page-sub">{jobs.length} jobs posted</div></div>
      </div>
      {msg.text && <div className={msg.type==="success"?"success-msg":"error-msg"} style={{marginBottom:20}}>{msg.text}</div>}

      <div className="stats-row">
        <div className="stat-card"><div className="stat-num">{jobs.length}</div><div className="stat-label">Jobs Posted</div></div>
        <div className="stat-card"><div className="stat-num">{Object.values(applicants).reduce((s,a)=>s+a.length,0)}</div><div className="stat-label">Total Applicants</div></div>
      </div>

      {jobs.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-icon">📝</div><div className="empty-title">No jobs posted yet</div><p>Go to Post Job to add one!</p></div></div>
      ) : (
        <div className="card" style={{padding: 0, overflow:"hidden"}}>
          {jobs.map(job => (
            <div key={job.id}>
              <div className="recruiter-job-item">
                <div className="rji-header">
                  <div>
                    <div className="rji-title">{job.title}</div>
                    <div className="rji-meta">
                      {job.requiredExperience}+ yrs exp
                      {job.skills?.length > 0 && <> • {job.skills.map(s=>s.name).join(", ")}</>}
                    </div>
                  </div>
                  <div className="rji-actions">
                    <button className="view-apps-btn" onClick={() => toggleApplicants(job.id)}>
                      {expandedJob === job.id ? "Hide Applicants ▲" : "View Applicants ▼"}
                    </button>
                    <button className="btn-icon btn-edit" onClick={() => setEditJob({...job, skillNames: job.skills?.map(s=>s.name).join(", ")||""})}>✏️ Edit</button>
                    <button className="btn-icon btn-delete" onClick={() => setDeleteJob(job)}>🗑️ Delete</button>
                  </div>
                </div>
              </div>

              {expandedJob === job.id && (
                <div style={{padding: "0 20px 20px"}}>
                  <div className="applicants-panel">
                    <div className="applicants-panel-title">Applicants for "{job.title}"</div>
                    {loadingApps === job.id ? <div className="spinner" style={{margin:"20px auto"}} /> :
                     !applicants[job.id] || applicants[job.id].length === 0 ? (
                      <div style={{color:"var(--muted)", textAlign:"center", padding:"20px"}}>No applicants yet</div>
                     ) : (
                      <table className="app-table" style={{background:"transparent"}}>
                        <thead><tr><th>Candidate</th><th>Email</th><th>Experience</th><th>Match Score</th></tr></thead>
                        <tbody>
                          {applicants[job.id].map(app => (
                            <tr key={app.id}>
                              <td style={{fontWeight:600}}>{app.candidate?.user?.name || "Candidate"}</td>
                              <td style={{color:"var(--muted)"}}>{app.candidate?.user?.email}</td>
                              <td style={{color:"var(--muted2)"}}>{app.candidate?.experience||0} yrs</td>
                              <td><span className={`score-badge ${scoreClass(app.matchScore||0)}`}>{Math.round(app.matchScore||0)}%</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editJob && <EditJobModal job={editJob} token={token} onClose={() => setEditJob(null)} onSaved={job => { setJobs(j => j.map(x => x.id===job.id ? job : x)); setEditJob(null); setMsg({text:"Job updated!",type:"success"}); }} />}

      {/* Delete Confirm */}
      {deleteJob && (
        <div className="modal-overlay" onClick={() => setDeleteJob(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">Delete Job</div><button className="modal-close" onClick={() => setDeleteJob(null)}>×</button></div>
            <p style={{color:"var(--muted2)"}}>Are you sure you want to delete <strong style={{color:"var(--text)"}}>{deleteJob.title}</strong>? This cannot be undone.</p>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDeleteJob(null)}>Cancel</button>
              <button className="btn-danger-solid" onClick={handleDelete}>Delete Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Edit Job Modal ────────────────────────────────────────────────────────────
function EditJobModal({ job, token, onClose, onSaved }) {
  const [form, setForm] = useState({ title: job.title||"", description: job.description||"", requiredExperience: job.requiredExperience||"", skillNames: job.skillNames||"" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));

  const save = async () => {
    setSaving(true); setError("");
    try {
      const payload = {...form, requiredExperience: parseInt(form.requiredExperience)||0, skillNames: form.skillNames.split(",").map(s=>s.trim()).filter(Boolean)};
      const updated = await api.put(`/jobs/update/${job.id}`, payload, token);
      onSaved(updated);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><div className="modal-title">Edit Job</div><button className="modal-close" onClick={onClose}>×</button></div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-group"><label className="form-label">Job Title</label><input className="form-input" value={form.title} onChange={set("title")} /></div>
        <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={3} value={form.description} onChange={set("description")} /></div>
        <div className="form-group"><label className="form-label">Required Experience (years)</label><input className="form-input" type="number" value={form.requiredExperience} onChange={set("requiredExperience")} /></div>
        <div className="form-group"><label className="form-label">Required Skills (comma separated)</label><input className="form-input" value={form.skillNames} onChange={set("skillNames")} /></div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Post Job ──────────────────────────────────────────────────────────────────
function PostJobPage({ token }) {
  const [form, setForm] = useState({ title: "", description: "", requiredExperience: "", skillNames: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));

  const submit = async () => {
    setLoading(true); setMsg({ text: "", type: "" });
    try {
      const payload = {...form, requiredExperience: parseInt(form.requiredExperience)||0, skillNames: form.skillNames.split(",").map(s=>s.trim()).filter(Boolean)};
      await api.post("/jobs/post", payload, token);
      setMsg({ text: "Job posted successfully! 🎉", type: "success" });
      setForm({ title: "", description: "", requiredExperience: "", skillNames: "" });
    } catch (e) { setMsg({ text: e.message, type: "error" }); }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header"><div><div className="page-title">Post a Job</div><div className="page-sub">Find your perfect candidate</div></div></div>
      <div className="card" style={{maxWidth: 600}}>
        {msg.text && <div className={msg.type==="success"?"success-msg":"error-msg"} style={{marginBottom:20}}>{msg.text}</div>}
        <div className="form-group"><label className="form-label">Job Title</label><input className="form-input" placeholder="e.g. Java Developer" value={form.title} onChange={set("title")} /></div>
        <div className="form-group"><label className="form-label">Job Description</label><textarea className="form-input" rows={4} placeholder="Describe the role, responsibilities..." value={form.description} onChange={set("description")} /></div>
        <div className="form-group"><label className="form-label">Required Experience (years)</label><input className="form-input" type="number" placeholder="e.g. 2" value={form.requiredExperience} onChange={set("requiredExperience")} /></div>
        <div className="form-group"><label className="form-label">Required Skills (comma separated)</label><input className="form-input" placeholder="e.g. Java, Spring Boot, MySQL" value={form.skillNames} onChange={set("skillNames")} /></div>
        <button className="btn-action" onClick={submit} disabled={loading}>{loading ? "Posting..." : "Post Job →"}</button>
      </div>
    </div>
  );
}

// ── All Applicants (Recruiter overview) ───────────────────────────────────────
function AllApplicantsPage({ token }) {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => { api.get("/jobs/my", token).then(data => { setJobs(data); if (data.length > 0) viewApplicants(data[0].id); }).catch(console.error).finally(() => setLoading(false)); }, [token]);

  const viewApplicants = async (jobId) => {
    setSelected(jobId); setLoadingApps(true);
    try { setApplicants(await api.get(`/applications/job/${jobId}`, token)); }
    catch { setApplicants([]); }
    setLoadingApps(false);
  };

  const scoreClass = s => s >= 70 ? "score-high" : s >= 40 ? "score-mid" : "score-low";

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header"><div><div className="page-title">All Applicants</div><div className="page-sub">View candidates by job</div></div></div>
      <div style={{display:"grid", gridTemplateColumns:"260px 1fr", gap:18}}>
        <div>
          <div style={{color:"var(--muted)", fontSize:"0.75rem", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, marginBottom:10}}>Your Jobs</div>
          {jobs.length === 0 ? <div className="card" style={{color:"var(--muted)", fontSize:"0.88rem"}}>No jobs yet</div>
          : jobs.map(job => (
            <div key={job.id} onClick={() => viewApplicants(job.id)} style={{padding:"12px 14px", borderRadius:9, marginBottom:8, cursor:"pointer",
              background: selected===job.id ? "rgba(0,229,195,0.08)" : "var(--surface)",
              border: `1px solid ${selected===job.id ? "rgba(0,229,195,0.35)" : "var(--border)"}`,
              color: selected===job.id ? "var(--accent)" : "var(--text)", fontSize:"0.88rem", fontWeight:500}}>
              {job.title}
              <div style={{color:"var(--muted)", fontSize:"0.78rem", marginTop:3, fontWeight:400}}>{job.requiredExperience}+ yrs exp</div>
            </div>
          ))}
        </div>
        <div className="card">
          {!selected ? (
            <div className="empty-state"><div className="empty-icon">👈</div><div className="empty-title">Select a job</div></div>
          ) : loadingApps ? <div className="spinner" />
          : applicants.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">👤</div><div className="empty-title">No applicants yet</div></div>
          ) : (
            <>
              <div style={{marginBottom:16, fontWeight:600, fontFamily:"'Syne',sans-serif"}}>{applicants.length} Applicant{applicants.length!==1?"s":""}</div>
              <table className="app-table">
                <thead><tr><th>Name</th><th>Email</th><th>Experience</th><th>Match Score</th></tr></thead>
                <tbody>
                  {applicants.sort((a,b)=>(b.matchScore||0)-(a.matchScore||0)).map(app => (
                    <tr key={app.id}>
                      <td style={{fontWeight:600}}>{app.candidate?.user?.name||"Candidate"}</td>
                      <td style={{color:"var(--muted)"}}>{app.candidate?.user?.email}</td>
                      <td style={{color:"var(--muted2)"}}>{app.candidate?.experience||0} yrs</td>
                      <td><span className={`score-badge ${scoreClass(app.matchScore||0)}`}>{Math.round(app.matchScore||0)}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [auth, setAuth] = useState({ token: null, role: null });
  const [page, setPage] = useState("jobs");

  const handleLogin = (token, role) => {
    setAuth({ token, role });
    setPage(role === "RECRUITER" ? "rec-jobs" : "jobs");
  };

  const handleLogout = () => { setAuth({ token: null, role: null }); setPage("jobs"); };

  const renderPage = () => {
    const { token, role } = auth;
    if (role === "CANDIDATE") {
      if (page === "jobs") return <JobsPage token={token} />;
      if (page === "applications") return <ApplicationsPage token={token} />;
      if (page === "profile") return <ProfilePage token={token} />;
    }
    if (role === "RECRUITER") {
      if (page === "rec-jobs") return <RecruiterJobsPage token={token} />;
      if (page === "post") return <PostJobPage token={token} />;
      if (page === "all-applicants") return <AllApplicantsPage token={token} />;
    }
    return null;
  };

  return (
    <>
      <style>{styles}</style>
      {!auth.token ? <AuthPage onLogin={handleLogin} /> : (
        <>
          <Navbar role={auth.role} page={page} setPage={setPage} onLogout={handleLogout} />
          {renderPage()}
        </>
      )}
    </>
  );
}
