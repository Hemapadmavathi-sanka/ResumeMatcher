import { useState, useEffect } from "react";
import api from "../api/api";

import CandidateProfileModal from "../components/CandidateProfileModal";

export default function AllApplicantsPage({ token }) {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [viewCandidate, setViewCandidate] = useState(null);
  const [viewScore, setViewScore] = useState(null);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadJobs = async (pageNum, append = false) => {
    try {
      const data = await api.get(`/jobs/my/paged?page=${pageNum}&size=10`, token);
      const myJobs = data.content || [];
      setHasMore(!data.last);
      setJobs(prev => {
        const updated = append ? [...prev, ...myJobs] : myJobs;
        if (!append && updated.length > 0) viewApplicants(updated[0].id);
        return updated;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadJobs(0); }, [token]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    await loadJobs(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  const viewApplicants = async (jobId) => {
    setSelected(jobId); setLoadingApps(true);
    try { setApplicants(await api.get(`/applications/job/${jobId}`, token)); }
    catch { setApplicants([]); }
    setLoadingApps(false);
  };

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status }, token);
      setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    } catch (e) {
      alert("Failed to update status: " + e.message);
    }
  };

  const scoreClass = s => s >= 70 ? "score-high" : s >= 40 ? "score-mid" : "score-low";
  const statusColor = s => {
    switch(s) {
      case "SHORTLISTED": return "#00e5c3";
      case "REJECTED": return "#ff4d4d";
      case "INTERVIEWING": return "#ffce00";
      case "SELECTED": return "#00b8ff";
      default: return "var(--muted)";
    }
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header"><div><div className="page-title">All Applicants</div><div className="page-sub">View and manage candidate status</div></div></div>
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
          {hasMore && jobs.length > 0 && (
            <div style={{textAlign:"center", marginTop: 10}}>
              <button className="btn-action" onClick={loadMore} disabled={loadingMore}
                style={{padding:"6px 16px", background:"var(--surface)", border:"1px solid var(--border2)", color:"var(--accent)", fontSize:"0.8rem"}}>
                {loadingMore ? "..." : "Load More ↓"}
              </button>
            </div>
          )}
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
                <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Match Score</th><th>Actions</th></tr></thead>
                <tbody>
                  {applicants.sort((a,b)=>(b.matchScore||0)-(a.matchScore||0)).map(app => (
                    <tr key={app.id}>
                      <td style={{fontWeight:600}}>{app.candidate?.user?.name||"Candidate"}</td>
                      <td style={{color:"var(--muted)"}}>{app.candidate?.user?.email}</td>
                      <td>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', background: `${statusColor(app.status)}22`, color: statusColor(app.status), border: `1px solid ${statusColor(app.status)}44` }}>
                          {app.status}
                        </span>
                      </td>
                      <td><span className={`score-badge ${scoreClass(app.matchScore||0)}`}>{Math.round(app.matchScore||0)}%</span></td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-action" style={{padding: '6px 12px', fontSize: '0.8rem'}} onClick={() => { 
                          setViewCandidate({ 
                            ...app.candidate, 
                            currentAppId: app.id, 
                            currentStatus: app.status,
                            matchRationale: app.matchRationale 
                          }); 
                          setViewScore(Math.round(app.matchScore||0)); 
                        }}>View</button>
                        <select 
                          className="form-input" 
                          style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto', margin: 0 }}
                          value={app.status}
                          onChange={(e) => updateStatus(app.id, e.target.value)}
                        >
                          <option value="APPLIED">Applied</option>
                          <option value="SHORTLISTED">Shortlist</option>
                          <option value="INTERVIEWING">Interview</option>
                          <option value="REJECTED">Reject</option>
                          <option value="SELECTED">Hire</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* Candidate Profile Modal */}
      {viewCandidate && (
        <CandidateProfileModal candidate={viewCandidate} score={viewScore} onClose={() => { setViewCandidate(null); setViewScore(null); }} />
      )}
    </div>
  );
}
