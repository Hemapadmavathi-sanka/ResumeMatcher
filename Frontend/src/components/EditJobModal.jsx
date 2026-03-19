import { useState } from "react";
import api from "../api/api";

export default function EditJobModal({ job, token, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: job?.title || "",
    companyName: job?.companyName || "",
    description: job?.description || "",
    requiredExperience: job?.requiredExperience || 0,
    skillNames: job?.requiredSkills ? job.requiredSkills.map(s=>s.name).join(", ") : ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setError("");
    if (!form.title.trim() || !form.companyName.trim() || !form.description.trim()) {
      setError("Title, Company, and Description are required.");
      return;
    }
    if (!form.requiredExperience || isNaN(parseInt(form.requiredExperience))) { setError("Valid required experience is required."); return; }
    if (!form.skillNames.trim()) { setError("Please add at least one required skill."); return; }

    setLoading(true);
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
        <div className="form-group">
          <label className="form-label">Job Title</label>
          <input className="form-input" value={form.title} onChange={set("title")} placeholder="e.g. Senior Java Developer" />
        </div>
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input className="form-input" value={form.companyName} onChange={set("companyName")} placeholder="e.g. Google" />
        </div>
        <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={3} value={form.description} onChange={set("description")} /></div>
        <div className="form-group"><label className="form-label">Required Experience (years)</label><input className="form-input" type="number" value={form.requiredExperience} onChange={set("requiredExperience")} /></div>
        <div className="form-group"><label className="form-label">Required Skills (comma separated)</label><input className="form-input" value={form.skillNames} onChange={set("skillNames")} /></div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={save} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}
