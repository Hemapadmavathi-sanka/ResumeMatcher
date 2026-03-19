import { useState } from "react";
import api from "../api/api";

export default function PostJobPage({ token }) {
  const [form, setForm] = useState({ title: "", companyName: "", description: "", requiredExperience: "", skillNames: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));

  const submit = async () => {
    setMsg({ text: "", type: "" });
    if (!form.title.trim()) { setMsg({ text: "Job title is required.", type: "error" }); return; }
    if (!form.companyName.trim()) { setMsg({ text: "Company name is required.", type: "error" }); return; }
    if (!form.description.trim()) { setMsg({ text: "Description is required.", type: "error" }); return; }
    if (!form.requiredExperience || isNaN(parseInt(form.requiredExperience))) { setMsg({ text: "Valid required experience is required.", type: "error" }); return; }
    if (!form.skillNames.trim()) { setMsg({ text: "Please add at least one required skill.", type: "error" }); return; }

    setLoading(true);
    try {
      const payload = {...form, requiredExperience: parseInt(form.requiredExperience)||0, skillNames: form.skillNames.split(",").map(s=>s.trim()).filter(Boolean)};
      await api.post("/jobs/post", payload, token);
      setMsg({ text: "Job posted successfully! 🎉", type: "success" });
      setForm({ title: "", companyName: "", description: "", requiredExperience: "", skillNames: "" });
    } catch (e) { setMsg({ text: e.message, type: "error" }); }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header"><div><div className="page-title">Post a Job</div><div className="page-sub">Find your perfect candidate</div></div></div>
      <div className="card" style={{maxWidth: 600}}>
        {msg.text && <div className={msg.type==="success"?"success-msg":"error-msg"} style={{marginBottom:20}}>{msg.text}</div>}
        <div className="form-group"><label className="form-label">Job Title</label><input className="form-input" placeholder="e.g. Java Developer" value={form.title} onChange={set("title")} /></div>
        <div className="form-group"><label className="form-label">Company Name</label><input className="form-input" placeholder="e.g. Google" value={form.companyName} onChange={set("companyName")} /></div>
        <div className="form-group"><label className="form-label">Job Description</label><textarea className="form-input" rows={4} placeholder="Describe the role, responsibilities..." value={form.description} onChange={set("description")} /></div>
        <div className="form-group"><label className="form-label">Required Experience (years)</label><input className="form-input" type="number" placeholder="e.g. 2" value={form.requiredExperience} onChange={set("requiredExperience")} /></div>
        <div className="form-group"><label className="form-label">Required Skills (comma separated)</label><input className="form-input" placeholder="e.g. Java, Spring Boot, MySQL" value={form.skillNames} onChange={set("skillNames")} /></div>
        <button className="btn-action" onClick={submit} disabled={loading}>{loading ? "Posting..." : "Post Job →"}</button>
      </div>
    </div>
  );
}
