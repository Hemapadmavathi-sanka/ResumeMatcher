import { useState, useEffect } from "react";

export default function Navbar({ role, page, setPage, onLogout }) {
  const [photo, setPhoto] = useState(localStorage.getItem("rm_photo"));

  useEffect(() => {
    const handleUpdate = () => setPhoto(localStorage.getItem("rm_photo"));
    window.addEventListener("storage_update", handleUpdate);
    return () => window.removeEventListener("storage_update", handleUpdate);
  }, []);

  const links = role === "CANDIDATE"
    ? [{ id: "jobs", label: "Browse Jobs" }, { id: "applications", label: "My Applications" }, { id: "profile", label: "My Profile" }]
    : [{ id: "rec-jobs", label: "My Jobs" }, { id: "post", label: "Post Job" }, { id: "all-applicants", label: "All Applicants" }];

  return (
    <nav className="navbar">
      <div className="nav-brand">⚡ ResumeMatcher</div>
      <div className="nav-links">
        {links.map(l => <button key={l.id} className={`nav-link ${page === l.id ? "active" : ""}`} onClick={() => setPage(l.id)}>{l.label}</button>)}
      </div>
      <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {role === "CANDIDATE" && photo && (
          <div className="nav-avatar" onClick={() => setPage("profile")} style={{ cursor: 'pointer' }}>
            <img src={`http://localhost:8080${photo}?v=${new Date().getTime()}`} alt="Me" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent)', objectFit: 'cover' }} />
          </div>
        )}
        <span className={`role-badge ${role.toLowerCase()}`}>{role}</span>
        <button className="btn-logout" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
