// ─── Admin Projects Tab ───────────────────────────────────────────────────────
import React, { useEffect, useState, useCallback } from "react";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { projectApi } from "../../../api/portfolioApi";

const EMPTY_PROJECT = {
  title: "", category: "Full Stack", summary: "",
  features: "", tech: "", featured: true, repo: "private", demo: "none",
};

export function ProjectsTab() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_PROJECT);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await projectApi.getAll();
      setProjects(res.data?.data || []);
    } catch { setError("Failed to load projects."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toPayload = (f) => ({
    title: f.title, category: f.category, summary: f.summary,
    features: typeof f.features === "string" ? f.features.split("\n").filter(Boolean) : f.features,
    tech: typeof f.tech === "string" ? f.tech.split(",").map((s) => s.trim()).filter(Boolean) : f.tech,
    featured: f.featured, repo: f.repo, demo: f.demo,
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const res = await projectApi.update(editingId, toPayload(form));
        setProjects((prev) => prev.map((p) => p.id === editingId ? res.data.data : p));
      } else {
        const res = await projectApi.create(toPayload(form));
        setProjects((prev) => [res.data.data, ...prev]);
      }
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_PROJECT);
      window.dispatchEvent(new Event("portfolio:refresh"));
    } catch (err) {
      setError(err.response?.data?.message || "Save failed.");
    } finally { setSaving(false); }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title, category: p.category, summary: p.summary,
      features: Array.isArray(p.features) ? p.features.join("\n") : p.features || "",
      tech: Array.isArray(p.tech) ? p.tech.join(", ") : p.tech || "",
      featured: p.featured, repo: p.repo, demo: p.demo,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await projectApi.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      window.dispatchEvent(new Event("portfolio:refresh"));
    } catch { setError("Delete failed."); }
  };

  return (
    <div className="space-y-6 animate-rise">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-lg font-bold font-display">Manage Projects ({projects.length})</h3>
          <p className="text-xs text-muted-foreground">Add, edit, or remove portfolio project items</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-primary cursor-pointer">
            <RefreshCw className="size-3.5" />
          </button>
          <button onClick={() => { setEditingId(null); setForm(EMPTY_PROJECT); setShowForm(true); }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow cursor-pointer hover:scale-[1.02]">
            <Plus className="size-4" /> Add Project
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSave} className="surface-card space-y-4 p-5 border-primary/40">
          <h4 className="text-sm font-bold">{editingId ? "Edit Project" : "New Project"}</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-muted-foreground">Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground">
                <option value="Full Stack">Full Stack</option>
                <option value="Java Backend">Java Backend</option>
                <option value="React Apps">React Apps</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Summary</label>
            <input required value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Bullet Features (one per line)</label>
            <textarea rows={3} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Tech Stack (comma-separated)</label>
            <input value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })}
              placeholder="Java, Spring Boot, React, MySQL"
              className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none" />
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
            Mark as Featured Project
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-xl border border-border px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer">Cancel</button>
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-1.5 text-xs font-semibold text-primary-foreground shadow cursor-pointer disabled:opacity-60">
              {saving && <Loader2 className="size-3.5 animate-spin" />} {saving ? "Saving..." : "Save Project"}
            </button>
          </div>
        </form>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
          <Loader2 className="size-5 animate-spin" /> Loading projects...
        </div>
      )}

      {/* Cards */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <div key={p.id} className="surface-card relative p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-accent">{p.category}</span>
                  {p.featured && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[0.6rem] font-bold text-primary">Featured</span>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(p)} className="rounded p-1 text-xs text-muted-foreground hover:text-primary cursor-pointer">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="rounded p-1 text-muted-foreground hover:text-destructive cursor-pointer">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <h4 className="mt-2 text-sm font-bold">{p.title}</h4>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.summary}</p>
              {Array.isArray(p.tech) && p.tech.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.tech.map((t) => <span key={t} className="rounded-full bg-background border border-border px-2 py-0.5 text-[0.6rem] text-muted-foreground">{t}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
