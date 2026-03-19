import { useState, useEffect } from "react";
import api from "../api/api";

export default function ApplicationsPage({ token }) {
  const [apps, setApps] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const [msg, setMsg] = useState({ text: "", type: "" });

  const fetchApps = async (pageNum, append = false) => {
    try {
      const data = await api.get(`/applications/my?page=${pageNum}&size=10`, token);
      const items = data.content || [];
      setApps(prev => append ? [...prev, ...items] : items);
      setTotalElements(data.totalElements || 0);
      setHasMore(!data.last);
    } catch (e) {
      console.error(e);
      setMsg({ text: "Failed to load applications. Please try again later.", type: "error" });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchApps(0).finally(() => setLoading(false));
  }, [token]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    await fetchApps(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
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
      <div className="page-header"><div><div className="page-title">My Applications</div><div className="page-sub">Track all your job applications</div></div></div>
      {msg.text && <div className={msg.type === "success" ? "success-msg" : "error-msg"} style={{marginBottom: 20}}>{msg.text}</div>}
      <div className="stats-row">
        <div className="stat-card"><div className="stat-num">{totalElements}</div><div className="stat-label">Total Applied</div></div>
        <div className="stat-card"><div className="stat-num">{apps.filter(a => (a.matchScore||0) >= 70).length}</div><div className="stat-label">Strong Matches</div></div>
        <div className="stat-card"><div className="stat-num">{apps.length ? Math.round(apps.reduce((s,a) => s+(a.matchScore||0),0)/apps.length) : 0}%</div><div className="stat-label">Avg Match Score</div></div>
      </div>
      <div className="card">
        {apps.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No applications yet</div><p>Browse jobs and apply!</p></div>
        ) : (
          <>
            <table className="app-table">
              <thead><tr><th>Job Title</th><th>Applied On</th><th>Status</th><th>Match Score</th></tr></thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app.id}>
                    <td style={{fontWeight: 600}}>{app.job?.title || "Job"}</td>
                    <td style={{color: "var(--muted)"}}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', background: `${statusColor(app.status)}22`, color: statusColor(app.status), border: `1px solid ${statusColor(app.status)}44` }}>
                        {app.status || 'APPLIED'}
                      </span>
                    </td>
                    <td><span className={`score-badge ${scoreClass(app.matchScore||0)}`}>{Math.round(app.matchScore||0)}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {hasMore && (
              <div style={{textAlign:"center", marginTop: 20}}>
                <button className="btn-action" onClick={loadMore} disabled={loadingMore}
                  style={{padding:"9px 28px", background:"var(--surface2)", border:"1px solid var(--border2)", color:"var(--accent)"}}>
                  {loadingMore ? "Loading..." : "Load More ↓"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
