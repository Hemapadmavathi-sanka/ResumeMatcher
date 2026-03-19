import React from 'react';
import api from '../api/api'; // using global api instance

export default function CandidateProfileModal({ candidate, score, onClose }) {
  if (!candidate) return null;

  // Render initials for the avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

  const name = candidate.user?.name || candidate.name || "Unknown Candidate";
  const email = candidate.user?.email || candidate.email || "";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ padding: 0, maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
        <div className="profile-view-card" style={{ border: 'none', margin: 0, borderRadius: '16px' }}>
          
          <div className="profile-cover">
            <button className="modal-close" style={{ position: 'absolute', top: '16px', right: '16px', color: '#fff', background: 'rgba(0,0,0,0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>&times;</button>
            <div className="profile-avatar-container">
              <div className="profile-avatar">{getInitials(name)}</div>
            </div>
          </div>

          <div className="profile-header-info">
            <div>
              <h2 className="profile-name">{name}</h2>
              <p className="profile-headline">{email}</p>
              <div className="profile-location">
                <span>📍 Candidates Location</span>
                <span>•</span>
                <span>{candidate.experience || 0} Years Experience</span>
              </div>
            </div>
            {score !== undefined && (
              <div className="profile-actions">
                <span className={`score-badge ${score >= 70 ? 'score-high' : score >= 40 ? 'score-mid' : 'score-low'}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
                  {score}% Match
                </span>
              </div>
            )}
          </div>

          <div className="divider" style={{ margin: '0 32px 32px 32px' }}></div>

          <div className="profile-section">
            <h3 className="profile-section-title">📊 Matching Details</h3>
            <div className="profile-detail-item">
              <div className="profile-detail-icon">📈</div>
              <div className="profile-detail-content">
                <h4>Match Score</h4>
                <p>{score}% - {score >= 70 ? 'Excellent Match' : score >= 40 ? 'Partial Match' : 'Low Relevance'}</p>
              </div>
            </div>
          </div>

          {candidate.matchRationale && (
             <div className="profile-section">
                <h3 className="profile-section-title">🤖 AI Match Analysis</h3>
                <div style={{ background: 'rgba(0,229,195,0.08)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(0,229,195,0.2)', fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6 }}>
                  {candidate.matchRationale}
                </div>
             </div>
          )}

          <div className="profile-section">
            <h3 className="profile-section-title">💼 Experience & Education</h3>
            <div className="profile-detail-item">
              <div className="profile-detail-icon">🏢</div>
              <div className="profile-detail-content">
                <h4>Total Experience</h4>
                <p>{candidate.experience || 0} Years</p>
              </div>
            </div>
            <div className="profile-detail-item">
              <div className="profile-detail-icon">🎓</div>
              <div className="profile-detail-content">
                <h4>Education</h4>
                <p>{candidate.education || 'Not specified'}</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="profile-section-title">🛠️ Skills</h3>
            {candidate.skills && candidate.skills.length > 0 ? (
              <div className="profile-skills-list">
                {candidate.skills.map((skill, index) => (
                  <span key={index} className="profile-skill-badge">{skill.name || skill}</span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--muted)' }}>No skills listed.</p>
            )}
          </div>

          {candidate.resumeText && (
             <div className="profile-section">
                <h3 className="profile-section-title">📄 Resume Content (Extracted)</h3>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--muted2)', maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {candidate.resumeText}
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
