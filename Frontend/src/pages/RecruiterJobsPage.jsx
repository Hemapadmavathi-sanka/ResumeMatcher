import { useState, useEffect } from "react";
import api from "../api/api";
import EditJobModal from "../components/EditJobModal";
import CandidateProfileModal from "../components/CandidateProfileModal";

export default function RecruiterJobsPage({ token }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [applicants, setApplicants] = useState({});
  const [loadingApps, setLoadingApps] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [deleteJob, setDeleteJob] = useState(null);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [viewCandidate, setViewCandidate] = useState(null);
  const [viewScore, setViewScore] = useState(null);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const loadJobs = async (pageNum, append = false) => {
    try {
      const data = await api.get(`/jobs/my/paged?page=${pageNum}&size=10`, token);
      const myJobs = data.content || [];
      setTotalElements(data.totalElements || 0);
      setHasMore(!data.last);

      setJobs(prev => append ? [...prev, ...myJobs] : myJobs);
      
      const appsMap = {};
      await Promise.all(
        myJobs.map(async (job) => {
          try {
            const apps = await api.get(`/applications/job/${job.id}`, token);
            appsMap[job.id] = apps;
          } catch {
            appsMap[job.id] = [];
          }
        })
      );
      setApplicants(prev => ({...prev, ...appsMap}));
    } catch (e) {
      console.error(e);
      setMsg({ text: "Failed to load jobs", type: "error" });
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
        <div><div className="page-title">My Jobs</div><div className="page-sub">{totalElements} jobs posted</div></div>
      </div>
      {msg.text && <div className={msg.type==="success"?"success-msg":"error-msg"} style={{marginBottom:20}}>{msg.text}</div>}

      <div className="stats-row">
        <div className="stat-card"><div className="stat-num">{totalElements}</div><div className="stat-label">Jobs Posted</div></div>
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
                        <thead><tr><th>Candidate</th><th>Email</th><th>Experience</th><th>Match Score</th><th>Actions</th></tr></thead>
                        <tbody>
                          {applicants[job.id].map(app => (
                            <tr key={app.id}>
                              <td style={{fontWeight:600}}>{app.candidate?.user?.name || "Candidate"}</td>
                              <td style={{color:"var(--muted)"}}>{app.candidate?.user?.email}</td>
                              <td style={{color:"var(--muted2)"}}>{app.candidate?.experience||0} yrs</td>
                              <td><span className={`score-badge ${scoreClass(app.matchScore||0)}`}>{Math.round(app.matchScore||0)}%</span></td>
                              <td><button className="btn-action" style={{padding: '6px 12px', fontSize: '0.8rem'}} onClick={() => { setViewCandidate(app.candidate); setViewScore(Math.round(app.matchScore||0)); }}>View Profile</button></td>
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
          {hasMore && (
            <div style={{textAlign:"center", padding: 20}}>
              <button className="btn-action" onClick={loadMore} disabled={loadingMore}
                style={{padding:"10px 32px", background:"var(--surface)", border:"1px solid var(--border2)", color:"var(--accent)"}}>
                {loadingMore ? "Loading..." : "Load More Jobs ↓"}
              </button>
            </div>
          )}
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

      {/* Candidate Profile Modal */}
      {viewCandidate && (
        <CandidateProfileModal candidate={viewCandidate} score={viewScore} onClose={() => { setViewCandidate(null); setViewScore(null); }} />
      )}
    </div>
  );
}
