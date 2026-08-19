// ─── Admin Tech Orbit Rings Tab ───────────────────────────────────────────────
import React, { useEffect, useState, useCallback } from "react";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { orbitApi } from "../../../api/portfolioApi";

export function OrbitTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [orbitTab, setOrbitTab] = useState("OUTER"); // 'OUTER' | 'INNER'
  const [showAddOrbit, setShowAddOrbit] = useState(false);
  const [editingOrbitId, setEditingOrbitId] = useState(null);
  const [orbitForm, setOrbitForm] = useState({ name: "", shortLabel: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orbitApi.getAll();
      setItems(res.data?.data || []);
    } catch {
      setError("Failed to load tech orbit badges.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const outerItems = items.filter((i) => i.orbitType === "OUTER");
  const innerItems = items.filter((i) => i.orbitType === "INNER");
  const currentList = orbitTab === "OUTER" ? outerItems : innerItems;

  const handleSaveOrbit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: orbitForm.name,
        shortLabel: orbitForm.shortLabel,
        orbitType: orbitTab,
      };

      if (editingOrbitId) {
        const res = await orbitApi.update(editingOrbitId, payload);
        setItems((prev) => prev.map((item) => (item.id === editingOrbitId ? res.data.data : item)));
      } else {
        const res = await orbitApi.create(payload);
        setItems((prev) => [...prev, res.data.data]);
      }

      setShowAddOrbit(false);
      setEditingOrbitId(null);
      setOrbitForm({ name: "", shortLabel: "" });
      window.dispatchEvent(new Event("portfolio:refresh"));
    } catch (err) {
      setError(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditOrbitClick = (item) => {
    setEditingOrbitId(item.id);
    setOrbitForm({ name: item.name, shortLabel: item.shortLabel || item.short || "" });
    setOrbitTab(item.orbitType || "OUTER");
    setShowAddOrbit(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tech badge?")) return;
    try {
      await orbitApi.delete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      window.dispatchEvent(new Event("portfolio:refresh"));
    } catch {
      setError("Delete failed.");
    }
  };

  return (
    <div className="space-y-6 animate-rise">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-lg font-bold font-display">Spinning Tech Orbit Badges ({items.length})</h3>
          <p className="text-xs text-muted-foreground">Manage animated technology bubbles rotating around the Hero photo</p>
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
              setEditingOrbitId(null);
              setOrbitForm({ name: "", shortLabel: "" });
              setShowAddOrbit(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="size-4" /> Add Tech Badge
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Sub tabs: Outer vs Inner */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setOrbitTab("OUTER")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
            orbitTab === "OUTER"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-surface-elevated text-muted-foreground hover:text-foreground"
          }`}
        >
          Outer Orbit Ring ({outerItems.length} items)
        </button>
        <button
          type="button"
          onClick={() => setOrbitTab("INNER")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
            orbitTab === "INNER"
              ? "bg-accent text-accent-foreground"
              : "border border-border bg-surface-elevated text-muted-foreground hover:text-foreground"
          }`}
        >
          Inner Orbit Ring ({innerItems.length} items)
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddOrbit && (
        <form onSubmit={handleSaveOrbit} className="surface-card space-y-4 p-5 border-primary/40">
          <h4 className="text-sm font-bold">
            {editingOrbitId ? "Edit Tech Badge" : `Add New Badge to ${orbitTab === "OUTER" ? "Outer" : "Inner"} Orbit`}
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-muted-foreground">Full Tech Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Docker or Spring Security"
                value={orbitForm.name}
                onChange={(e) => setOrbitForm({ ...orbitForm, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground">Short Badge Label (1-4 chars)</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="e.g. Dock"
                value={orbitForm.shortLabel}
                onChange={(e) => setOrbitForm({ ...orbitForm, shortLabel: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddOrbit(false)}
              className="rounded-xl border border-border px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-1.5 text-xs font-semibold text-primary-foreground shadow cursor-pointer disabled:opacity-60"
            >
              {saving && <Loader2 className="size-3.5 animate-spin" />} {saving ? "Saving..." : "Save Badge"}
            </button>
          </div>
        </form>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
          <Loader2 className="size-5 animate-spin" /> Loading badges...
        </div>
      )}

      {/* Badge List */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-3">
          {currentList.map((item) => (
            <div key={item.id} className="surface-card flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span
                  className={`grid size-10 place-items-center rounded-full border border-border font-mono text-xs font-bold ${
                    orbitTab === "OUTER" ? "bg-background text-primary" : "bg-surface-elevated text-accent"
                  }`}
                >
                  {item.shortLabel || item.short}
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">{item.name}</p>
                  <span className="text-[0.65rem] text-muted-foreground">
                    {orbitTab === "OUTER" ? "Outer Ring" : "Inner Ring"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleEditOrbitClick(item)}
                  className="rounded p-1 text-xs text-muted-foreground hover:text-primary cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="rounded p-1 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
