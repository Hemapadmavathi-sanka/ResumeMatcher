import { useState, useEffect } from "react";
import api from "../api/api";

export default function JobsPage({ token }) {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [applying, setApplying] = useState(null);
  const [applied, setApplied] = useState(new Set());
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [totalElements, setTotalElements] = useState(0);

  // Filters state
  const [filters, setFilters] = useState({ title: "", company: "", location: "", maxExp: "" });

  const fetchJobs = async (pageNum, append = false, currentFilters = filters) => {
    try {
      const { title, company, location, maxExp } = currentFilters;
      let url = `/jobs?page=${pageNum}&size=10`;
      if (title.trim()) url += `&title=${encodeURIComponent(title.trim())}`;
      if (company.trim()) url += `&company=${encodeURIComponent(company.trim())}`;
      if (location && location.trim()) url += `&location=${encodeURIComponent(location.trim())}`;
      if (maxExp !== "") url += `&maxExp=${maxExp}`;

      const data = await api.get(url, token);
      const newJobs = data.content || [];
      setJobs(prev => append ? [...prev, ...newJobs] : newJobs);
      setTotalElements(data.totalElements || 0);
      setHasMore(!data.last);
    } catch (e) { 
      console.error(e);
      setMsg({ text: "Failed to load jobs. Please try again later.", type: "error" });
    }
  };

  useEffect(() => {
    // Debounce search to prevent excessive API calls and UI flickering
    const timer = setTimeout(() => {
      // Don't set total elements to 0 here to avoid layout jump
      fetchJobs(0, false, filters).finally(() => setLoading(false));
      setPage(0);
    }, 400); // 400ms delay

    return () => clearTimeout(timer);
  }, [token, filters]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    await fetchJobs(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

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
      <div className="page-header" style={{flexDirection:'column', alignItems:'stretch', gap: 20}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div className="page-title">Browse Jobs</div>
            <div className="page-sub">{totalElements} opportunities available</div>
          </div>
        </div>

        <div className="search-bar-container" style={{display:'flex', gap: 12, flexWrap:'wrap', background:'rgba(255,255,255,0.03)', padding:'12px', borderRadius:'14px', border:'1px solid var(--border)'}}>
          <div className="search-input-group" style={{flex: 1, minWidth: '180px'}}>
            <input className="form-input" placeholder="🔍 Job Title or Keywords" value={filters.title} 
              onChange={e => setFilters(f => ({...f, title: e.target.value}))} />
          </div>
          <div className="search-input-group" style={{flex: 1, minWidth: '160px'}}>
            <input className="form-input" placeholder="🏢 Company" value={filters.company} 
              onChange={e => setFilters(f => ({...f, company: e.target.value}))} />
          </div>
          <div className="search-input-group" style={{flex: 1, minWidth: '160px'}}>
            <input className="form-input" placeholder="📍 Location / Remote" value={filters.location} 
              onChange={e => setFilters(f => ({...f, location: e.target.value}))} />
          </div>
          <div className="search-input-group" style={{width: '180px'}}>
            <select className="form-select" value={filters.maxExp} onChange={e => setFilters(f => ({...f, maxExp: e.target.value}))}>
              <option value="">Any Experience</option>
              <option value="0">Fresher (0 Exp)</option>
              <option value="1">1+ Year</option>
              <option value="3">3+ Years</option>
              <option value="5">5+ Years</option>
            </select>
          </div>
        </div>
      </div>

      {msg.text && <div className={msg.type === "success" ? "success-msg" : "error-msg"} style={{marginBottom: 20}}>{msg.text}</div>}
      
      {jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No matching jobs found</div>
          <p>Try adjusting your search or filters.</p>
          <button className="btn-action" onClick={() => setFilters({ title: "", company: "", maxExp: "" })} style={{marginTop: 12, background:'var(--surface)', border:'1px solid var(--border2)', color:'var(--accent)'}}>Clear All Filters</button>
        </div>
      ) : (
        <>
          <div className="card-grid">
            {jobs.map(job => (
              <div className="job-card" key={job.id}>
                <div className="job-card-header">
                  <div className="job-title-text">{job.title}</div>
                  <div className="job-company" style={{fontSize:'0.85rem', color:'var(--accent)', fontWeight:600}}>{job.companyName || "Unknown Company"}</div>
                </div>
                <div className="job-recruiter" style={{marginTop: 4}}>Posted by {job.recruiter?.name || "Recruiter"}</div>
                <div className="job-desc">{job.description}</div>
                <div className="job-meta">
                  <span className="meta-chip exp">🎯 {job.requiredExperience === 0 ? "Fresher" : `${job.requiredExperience}+ yrs exp`}</span>
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
          {hasMore && (
            <div style={{textAlign:"center", marginTop: 24}}>
              <button className="btn-action" onClick={loadMore} disabled={loadingMore}
                style={{padding:"10px 32px", background:"var(--surface)", border:"1px solid var(--border2)", color:"var(--accent)"}}>
                {loadingMore ? "Loading..." : "Load More Jobs ↓"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
