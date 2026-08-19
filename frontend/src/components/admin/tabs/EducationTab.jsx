// ─── Admin Education Tab ──────────────────────────────────────────────────────
import React, { useEffect, useState, useCallback } from "react";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { educationApi } from "../../../api/portfolioApi";

const EMPTY_EDU = { title: "", org: "", meta: "", note: "" };

export function EducationTab() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_EDU);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await educationApi.getAll();
      setEducation(res.data?.data || []);
    } catch {
      setError("Failed to load education entries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const res = await educationApi.update(editingId, form);
        setEducation((prev) => prev.map((item) => (item.id === editingId ? res.data.data : item)));
      } else {
        const res = await educationApi.create(form);
        setEducation((prev) => [...prev, res.data.data]);
      }
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_EDU);
      window.dispatchEvent(new Event("portfolio:refresh"));
    } catch (err) {
      setError(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      org: item.org,
      meta: item.meta || "",
      note: item.note || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this education entry?")) return;
    try {
      await educationApi.delete(id);
      setEducation((prev) => prev.filter((item) => item.id !== id));
      window.dispatchEvent(new Event("portfolio:refresh"));
    } catch {
      setError("Delete failed.");
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-rise">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-display">Degrees &amp; Certifications ({education.length})</h3>
          <p className="text-xs text-muted-foreground">Manage formal education & training entries</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            title="Refresh education"
          >
            <RefreshCw className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(EMPTY_EDU);
              setShowForm(true);
            }}
            className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <Plus className="size-4" /> Add Education
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSave} className="surface-card space-y-4 p-4 sm:p-5 border-primary/40">
          <h4 className="text-sm font-bold">{editingId ? "Edit Education" : "Add Education"}</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground">Degree / Certification Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground">Organization / College</label>
              <input
                type="text"
                required
                value={form.org}
                onChange={(e) => setForm({ ...form, org: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground">Meta / Grade (e.g. CGPA 6.8 or Certified)</label>
            <input
              type="text"
              value={form.meta}
              onChange={(e) => setForm({ ...form, meta: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Notes / Description</label>
            <textarea
              rows={2}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow cursor-pointer disabled:opacity-60"
            >
              {saving && <Loader2 className="size-3.5 animate-spin" />} {saving ? "Saving..." : "Save Education"}
            </button>
          </div>
        </form>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
          <Loader2 className="size-5 animate-spin text-primary" /> Loading education...
        </div>
      )}

      {/* Education Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {education.map((e) => (
            <div key={e.id} className="surface-card p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-foreground truncate">{e.title}</h4>
                  <p className="text-xs text-primary font-medium">{e.org}</p>
                  {e.meta && <p className="mt-1 text-[0.7rem] font-mono text-muted-foreground">{e.meta}</p>}
                  {e.note && <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{e.note}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(e)}
                    className="rounded px-2 py-1 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(e.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded p-1 transition-colors"
                    title="Delete education"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
