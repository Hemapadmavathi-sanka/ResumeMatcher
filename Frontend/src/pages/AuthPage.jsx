import { useState } from "react";
import api from "../api/api";

export default function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CANDIDATE" });
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError(""); setSuccess("");
    if (tab === "forgot") {
      if (!form.email.trim()) { setError("Email is required."); return; }
    } else if (tab === "reset") {
      if (!otp.trim()) { setError("OTP is required."); return; }
      if (newPassword.length < 6) { setError("New password must be at least 6 characters."); return; }
    } else if (tab !== "otp") {
      if (!form.email.trim() || !form.password.trim()) { setError("Email and password are required."); return; }
      if (tab === "register" && !form.name.trim()) { setError("Full name is required for registration."); return; }
    } else {
      if (!otp.trim()) { setError("Please enter the 6-digit OTP."); return; }
    }

    setLoading(true);
    try {
      if (tab === "register") {
        const res = await api.post("/auth/register", form);
        setSuccess(res.message || "OTP sent successfully! Please check your email.");
        setTab("otp");
      } else if (tab === "otp") {
        const data = await api.post("/auth/verify-otp", { email: form.email, otp });
        onLogin(data.token, data.role, form.name || "User", data.email || form.email);
      } else if (tab === "forgot") {
        const res = await api.post("/auth/forgot-password", { email: form.email });
        setSuccess(res.message);
        setTab("reset");
      } else if (tab === "reset") {
        const res = await api.post("/auth/reset-password", { email: form.email, otp, newPassword });
        setSuccess(res.message);
        setTab("login");
      } else {
        const data = await api.post("/auth/login", { email: form.email, password: form.password });
        onLogin(data.token, data.role, data.name, data.email || form.email);
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
          <div className="auth-title">
            {tab === "login" ? "Welcome back" : 
             tab === "register" ? "Create account" : 
             tab === "forgot" ? "Forgot Password" :
             tab === "reset" ? "Reset Password" : "Verify Email"}
          </div>
          <div className="auth-sub">
            {tab === "login" ? "Sign in to your account" : 
             tab === "register" ? "Join thousands of users" : 
             tab === "forgot" ? "Enter your email to receive an OTP" :
             tab === "reset" ? "Enter the OTP and your new password" : `Enter the OTP sent to ${form.email}`}
          </div>
          
          {(tab === "login" || tab === "register") && (
            <div className="tab-row">
              <button className={`tab-btn ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError(""); setSuccess(""); }}>Login</button>
              <button className={`tab-btn ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setError(""); setSuccess(""); }}>Register</button>
            </div>
          )}
          
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}
          
          {tab === "otp" || tab === "reset" ? (
            <>
              <div className="form-group">
                <label className="form-label">6-Digit OTP</label>
                <input className="form-input" placeholder="000000" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} />
              </div>
              {tab === "reset" && (
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input className="form-input" type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
              )}
            </>
          ) : tab === "forgot" ? (
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
            </div>
          ) : (
            <>
              {tab === "register" && <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="Your name" value={form.name} onChange={set("name")} /></div>}
              <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} /></div>
              <div className="form-group">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <label className="form-label">Password</label>
                  {tab === "login" && (
                    <button onClick={() => { setTab("forgot"); setError(""); setSuccess(""); }} style={{background:'none', border:'none', color:'var(--accent)', fontSize:'0.75rem', cursor:'pointer', marginBottom:'6px'}}>Forgot Password?</button>
                  )}
                </div>
                <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
              </div>
              {tab === "register" && (
                <div className="form-group">
                  <label className="form-label">I am a...</label>
                  <select className="form-select" value={form.role} onChange={set("role")}>
                    <option value="CANDIDATE">Job Seeker (Candidate)</option>
                    <option value="RECRUITER">Recruiter / HR</option>
                  </select>
                </div>
              )}
            </>
          )}
          
          <button className="btn-primary" onClick={submit} disabled={loading}>
            {loading ? "Please wait..." : 
             tab === "login" ? "Sign In →" : 
             tab === "register" ? "Create Account →" : 
             tab === "forgot" ? "Send OTP →" :
             tab === "reset" ? "Reset Password →" : "Verify & Login →"}
          </button>
          
          {(tab === "otp" || tab === "forgot" || tab === "reset") && (
            <button className="tab-btn" style={{width: '100%', marginTop: '12px'}} onClick={() => { setTab("login"); setSuccess(""); setError(""); }}>
              ← Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
