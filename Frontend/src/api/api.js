const API = "http://localhost:8080";

const api = {
  post: async (path, body, token) => {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { message: "Server error" }; }
    if (!res.ok) throw new Error(data.error || data.message || `Request failed: ${res.status}`);
    return data;
  },
  put: async (path, body, token) => {
    const res = await fetch(`${API}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { message: "Server error" }; }
    if (!res.ok) throw new Error(data.error || data.message || `Update failed: ${res.status}`);
    return data;
  },
  delete: async (path, token) => {
    const res = await fetch(`${API}${path}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const text = await res.text();
      let msg = "Delete failed";
      try { const data = JSON.parse(text); msg = data.error || data.message || msg; } catch {}
      throw new Error(msg);
    }
    return true;
  },
  get: async (path, token) => {
    const res = await fetch(`${API}${path}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    
    if (!res.ok) {
        // Handle 401/403 specifically if needed, otherwise throw error
        const text = await res.text();
        let errorMsg = "Request failed";
        try {
            const data = JSON.parse(text);
            errorMsg = data.error || data.message || errorMsg;
        } catch {
            errorMsg = `Server error: ${res.status}`;
        }
        throw new Error(errorMsg);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : {};
  },
  upload: async (path, formData, token) => {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    const text = await res.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { message: "Server error" }; }
    if (!res.ok) throw new Error(data.error || data.message || `Upload failed: ${res.status}`);
    return data;
  },
  patch: async (path, params, token) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    const res = await fetch(`${API}${path}${query}`, {
      method: "PATCH",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    const text = await res.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { message: "Server error" }; }
    if (!res.ok) throw new Error(data.error || data.message || `Update failed: ${res.status}`);
    return data;
  },
};

export default api;
