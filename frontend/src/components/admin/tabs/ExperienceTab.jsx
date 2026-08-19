// ─── Admin Experience Tab ─────────────────────────────────────────────────────
import React, { useEffect, useState, useCallback } from "react";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { experienceApi } from "../../../api/portfolioApi";

const EMPTY_EXP = {
  type: "Employment",
  company: "",
  role: "",
  period: "Present",
  context: "",
  points: "",
  tech: "",
};

export function ExperienceTab() {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_EXP);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await experienceApi.getAll();
      setExperience(res.data?.data || []);
    } catch {
      setError("Failed to load experience.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toPayload = (f) => ({
    type: f.type,
    company: f.company,
    role: f.role,
    period: f.period,
    context: f.context,
    points: typeof f.points === "string" ? f.points.split("\n").filter(Boolean) : f.points,
    tech: typeof f.tech === "string" ? f.tech.split(",").map((s) => s.trim()).filter(Boolean) : f.tech,
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const res = await experienceApi.update(editingId, toPayload(form));
        setExperience((prev) => prev.map((item) => (item.id === editingId ? res.data.data : item)));
      } else {
        const res = await experienceApi.create(toPayload(form));
        setExperience((prev) => [res.data.data, ...prev]);
      }
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_EXP);
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
      type: item.type,
      company: item.company,
      role: item.role,
      period: item.period || "",
      context: item.context || "",
      points: Array.isArray(item.points) ? item.points.join("\n") : item.points || "",
      tech: Array.isArray(item.tech) ? item.tech.join(", ") : item.tech || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience entry?")) return;
    try {
      await experienceApi.delete(id);
      setExperience((prev) => prev.filter((item) => item.id !== id));
      window.dispatchEvent(new Event("portfolio:refresh"));
    } catch {
      setError("Delete failed.");
    }
  };

  return (
    <div className="space-y-6 animate-rise">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-lg font-bold font-display">Experience Timeline ({experience.length})</h3>
          <p className="text-xs text-muted-foreground">Manage employment & training history</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-primary cursor-pointer"
          >
            <RefreshCw className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(EMPTY_EXP);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="size-4" /> Add Experience Entry
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSave} className="surface-card space-y-4 p-5 border-primary/40">
          <h4 className="text-sm font-bold">{editingId ? "Edit Experience" : "Add Experience Entry"}</h4>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="Employment">Employment</option>
                <option value="Training">Training</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground">Company / Organization</label>
              <input
                type="text"
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground">Role</label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-muted-foreground">Period</label>
              <input
                type="text"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                placeholder="e.g. Present or 2023 - 2024"
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground">Context / Subtitle</label>
              <input
                type="text"
                value={form.context}
                onChange={(e) => setForm({ ...form, context: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground">Bullet Points (One per line)</label>
            <textarea
              rows={3}
              value={form.points}
              onChange={(e) => setForm({ ...form, points: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground">Technologies (Comma-separated)</label>
            <input
              type="text"
              value={form.tech}
              onChange={(e) => setForm({ ...form, tech: e.target.value })}
              placeholder="Java, Spring Boot, MySQL, React"
              className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-border px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-1.5 text-xs font-semibold text-primary-foreground shadow cursor-pointer disabled:opacity-60"
            >
              {saving && <Loader2 className="size-3.5 animate-spin" />} {saving ? "Saving..." : "Save Experience"}
            </button>
          </div>
        </form>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
          <Loader2 className="size-5 animate-spin" /> Loading experience...
        </div>
      )}

      {/* Experience Cards */}
      {!loading && (
        <div className="space-y-4">
          {experience.map((e) => (
            <div key={e.id} className="surface-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[0.65rem] font-semibold text-primary">
                    {e.type}
                  </span>
                  <h4 className="mt-1.5 text-sm font-bold">{e.company}</h4>
                  <p className="text-xs text-primary font-medium">{e.role}</p>
                  {e.period && <p className="text-[0.7rem] text-muted-foreground mt-0.5">{e.period}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(e)}
                    className="rounded p-1 text-xs text-muted-foreground hover:text-primary cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(e.id)}
                    className="rounded p-1 text-muted-foreground hover:text-destructive cursor-pointer"
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
