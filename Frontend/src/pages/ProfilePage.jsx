import { useState, useEffect } from "react";
import api from "../api/api";
import CandidateProfileModal from "../components/CandidateProfileModal";

export default function ProfilePage({ token }) {
  const [form, setForm] = useState({ education: "", experience: "", resumeText: "", skillNames: "" });
  const [candidateData, setCandidateData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const u = await api.get("/auth/me", token);
      setUserInfo(u);
      
      if (u.role === "CANDIDATE") {
        try {
          const p = await api.get("/candidate/profile", token);
          setCandidateData(p);
          if (p.profilePictureUrl) {
            localStorage.setItem("rm_photo", p.profilePictureUrl);
            window.dispatchEvent(new Event("storage_update"));
          }
          setForm({ 
            education: p.education||"", 
            experience: p.experience||"", 
            resumeText: p.resumeText||"", 
            skillNames: Array.isArray(p.skills) ? p.skills.map(s=>s.name).join(", ") : "" 
          });
        } catch (e) {
          console.log("No candidate profile found yet.");
          setCandidateData(null);
        }
      }
    } catch (e) {
      setMsg("❌ Failed to load user info.");
    } finally {
      setLoading(false);
    }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setMsg("");
    if (!form.education.trim()) { setMsg("❌ Education is required."); return; }
    if (!form.experience || isNaN(parseInt(form.experience))) { setMsg("❌ Valid experience is required."); return; }
    if (!form.skillNames.trim()) { setMsg("❌ Please add at least one skill."); return; }

    setSaving(true);
    try {
      const skillsStr = Array.isArray(form.skillNames) ? form.skillNames.join(", ") : form.skillNames;
      const raw = skillsStr.split(",").map(s => s.trim()).filter(Boolean);
      const unique = raw.filter((s,i) => raw.findIndex(x => x.toLowerCase()===s.toLowerCase())===i);
      const res = await api.post("/candidate/profile", { education: form.education, experience: parseInt(form.experience)||0, resumeText: form.resumeText, skillNames: unique }, token);
      setCandidateData(res);
      setMsg("Profile saved! ✅");
      setTimeout(() => { setIsEditing(false); setMsg(""); }, 1500);
    } catch (e) { setMsg("❌ " + e.message); }
    setSaving(false);
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  const getInitials = (n) => {
    if (!n) return "U";
    const parts = n.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n[0].toUpperCase();
  };

  const name = userInfo?.name || "User Name";
  const email = userInfo?.email || "user@example.com";
  const role = userInfo?.role || "USER";

  // If user is not a candidate, don't show the profile (they shouldn't reach here anyway)
  if (role !== "CANDIDATE") {
    return (
      <div className="page">
        <div className="card">
          <h3>No Profile Available</h3>
          <p>Profiles are currently only available for Candidate accounts.</p>
        </div>
      </div>
    );
  }

  // Candidate View (Detailed or Empty)
  if (!isEditing && candidateData) {
    return (
      <div className="page" style={{ maxWidth: '800px' }}>
        <div className="profile-view-card">
          <div className="profile-cover">
            <div className="profile-avatar-container">
              <input 
                id="photoUpload" 
                type="file" 
                accept="image/*" 
                style={{ display: "none" }} 
                onChange={async e => {
                  const file = e.target.files[0]; if (!file) return;
                  setMsg("Uploading profile photo...");
                  try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const res = await api.upload("/candidate/upload-photo", formData, token);
                    setCandidateData(res);
                    if (res.profilePictureUrl) {
                      localStorage.setItem("rm_photo", res.profilePictureUrl);
                      window.dispatchEvent(new Event("storage_update"));
                    }
                    setMsg("✅ Profile photo updated!");
                  } catch (err) {
                    setMsg("❌ Photo upload failed: " + err.message);
                  }
                }} 
              />
              <div 
                className="profile-avatar" 
                onClick={() => document.getElementById("photoUpload").click()}
                style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                title="Click to change photo"
              >
                {candidateData?.profilePictureUrl ? (
                  <img 
                    src={`http://localhost:8080${candidateData.profilePictureUrl}?v=${new Date().getTime()}`} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : getInitials(name)}
                <div className="avatar-overlay">📷</div>
              </div>
            </div>
            {msg && <div style={{ position: 'absolute', top: '10px', left: '32px', zIndex: 10, background: 'rgba(0,0,0,0.7)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', color: '#fff' }}>{msg}</div>}
            <button 
              className="btn-action" 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', color: '#000' }}
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          </div>

          <div className="profile-header-info">
            <div>
              <h2 className="profile-name">{name}</h2>
              <p className="profile-headline">{email}</p>
              <div className="profile-location">
                <span className="role-badge candidate">CANDIDATE</span>
                <span>•</span>
                <span>{candidateData.experience || 0} Years Experience</span>
              </div>
            </div>
          </div>

          <div className="divider" style={{ margin: '0 32px 32px 32px' }}></div>

          <div className="profile-section">
            <h3 className="profile-section-title">💼 Experience & Education</h3>
            <div className="profile-detail-item">
              <div className="profile-detail-icon">🏢</div>
              <div className="profile-detail-content">
                <h4>Total Experience</h4>
                <p>{candidateData.experience || 0} Years</p>
              </div>
            </div>
            <div className="profile-detail-item">
              <div className="profile-detail-icon">🎓</div>
              <div className="profile-detail-content">
                <h4>Education</h4>
                <p>{candidateData.education || 'Not specified'}</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="profile-section-title">🛠️ Skills</h3>
            {candidateData.skills && candidateData.skills.length > 0 ? (
              <div className="profile-skills-list">
                {candidateData.skills.map((skill, index) => (
                  <span key={index} className="profile-skill-badge">{skill.name || skill}</span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--muted)' }}>No skills listed.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <div>
          <div className="page-title">{candidateData ? "Edit Profile" : "Complete Your Profile"}</div>
          <div className="page-sub">Keep updated for better match scores</div>
        </div>
        {candidateData && (
          <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
        )}
      </div>
      
      <div className="card">
        {msg && <div className={msg.includes("❌") ? "error-msg" : "success-msg"} style={{marginBottom: 20}}>{msg}</div>}
        <div className="form-group"><label className="form-label">Education</label><input className="form-input" placeholder="e.g. B.Tech Computer Science" value={form.education} onChange={set("education")} /></div>
        <div className="form-group"><label className="form-label">Years of Experience</label><input className="form-input" type="number" placeholder="e.g. 2" value={form.experience} onChange={set("experience")} /></div>
        <div className="form-group"><label className="form-label">Skills (comma separated)</label><input className="form-input" placeholder="e.g. Java, Spring Boot, MySQL" value={form.skillNames} onChange={set("skillNames")} /></div>
        <div className="form-group">
          <label className="form-label">Upload Resume (PDF/DOCX)</label>
          <div className="pdf-upload-box" onClick={() => document.getElementById("resumeUpload").click()}>
            <input id="resumeUpload" type="file" accept=".pdf,.docx" style={{display:"none"}} onChange={async e => {
              const file = e.target.files[0]; if (!file) return;
              setMsg("Uploading and parsing resume...");
              try {
                const formData = new FormData();
                formData.append("file", file);
                const res = await api.upload("/candidate/upload-resume", formData, token);
                setCandidateData(res);
                setForm(f => ({ ...f, resumeText: res.resumeText }));
                setMsg(`✅ Resume uploaded and parsed successfully: ${file.name}`);
              } catch (err) {
                setMsg("❌ Failed to upload resume: " + err.message);
              }
            }} />
            <div className="pdf-icon">📄</div>
            <div className="pdf-upload-text">
              {candidateData?.resumeFileName ? `Current: ${candidateData.resumeFileName}` : "Click to upload resume"}
            </div>
            <div className="pdf-upload-sub">PDF or DOCX files supported</div>
          </div>
        </div>
        <button className="btn-action" onClick={save} disabled={saving} style={{ width: '100%', marginTop: '10px' }}>{saving ? "Saving..." : "Save Profile"}</button>
      </div>
    </div>
  );
}
