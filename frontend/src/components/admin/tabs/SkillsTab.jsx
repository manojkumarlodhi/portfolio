// ─── Admin Skills Tab ─────────────────────────────────────────────────────────
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Check,
  Edit2,
  FolderPlus,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { skillApi } from "../../../api/portfolioApi";

export function SkillsTab() {
  const [skillGroups, setSkillGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Category Modal / Form
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ title: "", items: "" });

  // Quick Add input state per group { [groupId]: "newSkillName" }
  const [quickAddInput, setQuickAddInput] = useState({});
  const [addingSkillToGroup, setAddingSkillToGroup] = useState(null);

  // In-place Skill Editing { groupId: "...", skillIndex: 0, currentValue: "..." }
  const [editingSkill, setEditingSkill] = useState(null);
  const editSkillInputRef = useRef(null);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await skillApi.getAll();
      setSkillGroups(res.data?.data || []);
    } catch {
      setError("Failed to load skills.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (editingSkill && editSkillInputRef.current) {
      editSkillInputRef.current.focus();
      editSkillInputRef.current.select();
    }
  }, [editingSkill]);

  // ── Open Category Create/Edit Modal ──
  const handleOpenCategoryModal = (group = null) => {
    if (group) {
      setEditingGroupId(group.id);
      setCategoryForm({
        title: group.title,
        items: (group.items || []).join(", "),
      });
    } else {
      setEditingGroupId(null);
      setCategoryForm({ title: "", items: "" });
    }
    setShowCategoryModal(true);
    setError(null);
  };

  // ── Save Full Category (Create or Edit) ──
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.title.trim()) return;

    const items = categoryForm.items
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (items.length === 0) {
      setError("Please add at least one skill item.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingGroupId) {
        const res = await skillApi.update(editingGroupId, {
          title: categoryForm.title.trim(),
          items,
        });
        const updated = res.data?.data;
        setSkillGroups((prev) =>
          prev.map((g) => (g.id === editingGroupId ? updated : g))
        );
        showNotification(`Category "${updated.title}" updated successfully!`);
      } else {
        const res = await skillApi.create({
          title: categoryForm.title.trim(),
          items,
        });
        setSkillGroups((prev) => [...prev, res.data?.data]);
        showNotification(`New category "${categoryForm.title}" created!`);
      }
      setShowCategoryModal(false);
      setEditingGroupId(null);
      setCategoryForm({ title: "", items: "" });
      window.dispatchEvent(new Event("portfolio:refresh"));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete Whole Category ──
  const handleDeleteCategory = async (id, title) => {
    if (!window.confirm(`Delete entire category "${title}" and all its skills?`))
      return;
    try {
      await skillApi.delete(id);
      setSkillGroups((prev) => prev.filter((g) => g.id !== id));
      showNotification(`Category "${title}" deleted.`);
      window.dispatchEvent(new Event("portfolio:refresh"));
    } catch {
      setError("Delete failed. Please try again.");
    }
  };

  // ── Delete an Individual Skill from Category ──
  const handleDeleteIndividualSkill = async (group, skillIndex) => {
    const skillName = group.items[skillIndex];
    const newItems = group.items.filter((_, idx) => idx !== skillIndex);

    if (newItems.length === 0) {
      if (
        !window.confirm(
          `Removing "${skillName}" will leave this category empty. Do you want to delete the whole category?`
        )
      ) {
        return;
      }
      return handleDeleteCategory(group.id, group.title);
    }

    // Optimistic UI update
    setSkillGroups((prev) =>
      prev.map((g) => (g.id === group.id ? { ...g, items: newItems } : g))
    );

    try {
      await skillApi.update(group.id, {
        title: group.title,
        items: newItems,
      });
      showNotification(`Skill "${skillName}" removed.`);
      window.dispatchEvent(new Event("portfolio:refresh"));
    } catch (err) {
      // Revert if failed
      setSkillGroups((prev) =>
        prev.map((g) => (g.id === group.id ? group : g))
      );
      setError(err.response?.data?.message || "Failed to remove skill.");
    }
  };

  // ── Add an Individual Skill to Category on the Fly ──
  const handleAddIndividualSkill = async (group) => {
    const rawVal = quickAddInput[group.id] || "";
    const newSkillNames = rawVal
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (newSkillNames.length === 0) return;

    // Filter duplicates
    const existingLower = (group.items || []).map((s) => s.toLowerCase());
    const uniqueToAdd = newSkillNames.filter(
      (s) => !existingLower.includes(s.toLowerCase())
    );

    if (uniqueToAdd.length === 0) {
      setError("Skill already exists in this category.");
      setQuickAddInput((prev) => ({ ...prev, [group.id]: "" }));
      return;
    }

    const updatedItems = [...(group.items || []), ...uniqueToAdd];

    setAddingSkillToGroup(group.id);
    try {
      const res = await skillApi.update(group.id, {
        title: group.title,
        items: updatedItems,
      });
      const updated = res.data?.data;
      setSkillGroups((prev) =>
        prev.map((g) => (g.id === group.id ? updated : g))
      );
      setQuickAddInput((prev) => ({ ...prev, [group.id]: "" }));
      showNotification(`Added ${uniqueToAdd.join(", ")} to ${group.title}!`);
      window.dispatchEvent(new Event("portfolio:refresh"));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add skill.");
    } finally {
      setAddingSkillToGroup(null);
    }
  };

  // ── Save In-Place Edited Individual Skill ──
  const handleSaveIndividualSkillEdit = async () => {
    if (!editingSkill) return;
    const { groupId, skillIndex, currentValue } = editingSkill;
    const trimmed = currentValue.trim();

    const group = skillGroups.find((g) => g.id === groupId);
    if (!group) {
      setEditingSkill(null);
      return;
    }

    const originalSkill = group.items[skillIndex];
    if (!trimmed || trimmed === originalSkill) {
      setEditingSkill(null);
      return;
    }

    const updatedItems = [...group.items];
    updatedItems[skillIndex] = trimmed;

    // Optimistic UI update
    setSkillGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, items: updatedItems } : g))
    );
    setEditingSkill(null);

    try {
      await skillApi.update(groupId, {
        title: group.title,
        items: updatedItems,
      });
      showNotification(`Updated skill to "${trimmed}"!`);
      window.dispatchEvent(new Event("portfolio:refresh"));
    } catch (err) {
      setSkillGroups((prev) =>
        prev.map((g) => (g.id === groupId ? group : g))
      );
      setError(err.response?.data?.message || "Failed to update skill.");
    }
  };

  // Filter skills based on search term
  const filteredGroups = skillGroups.filter((g) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const matchesTitle = g.title.toLowerCase().includes(term);
    const matchesItem = (g.items || []).some((item) =>
      item.toLowerCase().includes(term)
    );
    return matchesTitle || matchesItem;
  });

  const totalSkillsCount = skillGroups.reduce(
    (acc, g) => acc + (g.items?.length || 0),
    0
  );

  return (
    <div className="space-y-6 animate-rise">
      {/* ── Top Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold font-display">Manage Skills &amp; Categories</h3>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {totalSkillsCount} Skills across {skillGroups.length} Categories
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add, update, or delete individual skills directly or manage categories
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={load}
            title="Refresh skills"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:text-primary hover:border-primary cursor-pointer transition-colors"
          >
            <RefreshCw className="size-3.5" />
          </button>
          <button
            onClick={() => handleOpenCategoryModal(null)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <FolderPlus className="size-4" /> Add Category
          </button>
        </div>
      </div>

      {/* ── Notifications & Errors ── */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-primary/15 border border-primary/30 p-3 text-xs text-primary animate-rise">
          <Check className="size-4 shrink-0" /> {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center justify-between rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="cursor-pointer">
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* ── Search Bar ── */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search categories or specific skills (e.g. Java, React, Docker)..."
          className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none shadow-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* ── Category Modal (Create / Bulk Edit) ── */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveCategory}
            className="surface-card w-full max-w-lg space-y-4 p-6 border-primary/40 shadow-2xl rounded-2xl animate-rise"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h4 className="text-base font-bold font-display flex items-center gap-2">
                <Tag className="size-4 text-primary" />
                {editingGroupId ? "Edit Category & Skills" : "New Skill Category"}
              </h4>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground">
                Category Title <span className="text-destructive">*</span>
              </label>
              <input
                required
                value={categoryForm.title}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, title: e.target.value })
                }
                placeholder="e.g. Backend & Databases, Cloud & DevOps, Frontend"
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground">
                Skills in this category (comma-separated) <span className="text-destructive">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={categoryForm.items}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, items: e.target.value })
                }
                placeholder="Java 21, Spring Boot, PostgreSQL, Redis, Docker"
                className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
              <p className="mt-1 text-[0.65rem] text-muted-foreground">
                Enter multiple skills separated by commas. You can also add or edit individual skills later from the cards.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-md cursor-pointer disabled:opacity-60 hover:scale-[1.02]"
              >
                {saving && <Loader2 className="size-3.5 animate-spin" />}
                {saving ? "Saving..." : editingGroupId ? "Update Category" : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Loading State ── */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="size-5 animate-spin text-primary" /> Loading skill categories...
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && filteredGroups.length === 0 && (
        <div className="surface-card flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border-dashed">
          <Sparkles className="size-8 text-primary mb-2 opacity-80" />
          <h4 className="text-sm font-semibold">
            {searchTerm ? "No matching skills found" : "No skill categories yet"}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {searchTerm
              ? `No skills or categories matched "${searchTerm}". Try a different keyword.`
              : "Click '+ Add Category' above to create your first set of technical skills."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-3 text-xs text-primary hover:underline cursor-pointer"
            >
              Clear search filter
            </button>
          )}
        </div>
      )}

      {/* ── Skill Cards Grid ── */}
      {!loading && (
        <div className="grid gap-5 sm:grid-cols-2">
          {filteredGroups.map((g) => (
            <div
              key={g.id}
              className="surface-card relative flex flex-col justify-between rounded-2xl p-5 border border-border/80 hover:border-primary/40 transition-all shadow-sm group/card"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
                  <div>
                    <h4 className="text-sm font-bold font-display text-primary flex items-center gap-2">
                      <span>{g.title}</span>
                      <span className="text-[0.65rem] font-mono text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border">
                        {g.items?.length || 0} skills
                      </span>
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenCategoryModal(g)}
                      title="Edit Category Name & Bulk Skills"
                      className="rounded-lg p-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(g.id, g.title)}
                      title="Delete Entire Category"
                      className="rounded-lg p-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Individual Skill Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {(g.items || []).map((item, idx) => {
                    const isEditingThisSkill =
                      editingSkill?.groupId === g.id &&
                      editingSkill?.skillIndex === idx;

                    if (isEditingThisSkill) {
                      return (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1 rounded-full bg-primary/10 border-2 border-primary px-2.5 py-1 shadow-sm"
                        >
                          <input
                            ref={editSkillInputRef}
                            type="text"
                            value={editingSkill.currentValue}
                            onChange={(e) =>
                              setEditingSkill({
                                ...editingSkill,
                                currentValue: e.target.value,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveIndividualSkillEdit();
                              if (e.key === "Escape") setEditingSkill(null);
                            }}
                            className="w-24 text-[0.72rem] bg-transparent text-foreground font-medium focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleSaveIndividualSkillEdit}
                            title="Save skill name"
                            className="rounded-full p-0.5 text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                          >
                            <Check className="size-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSkill(null)}
                            title="Cancel"
                            className="rounded-full p-0.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={idx}
                        className="group/badge relative inline-flex items-center gap-1.5 rounded-full bg-background border border-border px-3 py-1 text-[0.75rem] font-medium text-foreground hover:border-primary/60 hover:bg-surface-elevated transition-all shadow-2xs"
                      >
                        {/* Skill Name (Click to edit) */}
                        <span
                          onClick={() =>
                            setEditingSkill({
                              groupId: g.id,
                              skillIndex: idx,
                              currentValue: item,
                            })
                          }
                          title="Click to edit skill name"
                          className="cursor-pointer hover:text-primary transition-colors select-none"
                        >
                          {item}
                        </span>

                        {/* Edit Icon on Hover */}
                        <button
                          type="button"
                          onClick={() =>
                            setEditingSkill({
                              groupId: g.id,
                              skillIndex: idx,
                              currentValue: item,
                            })
                          }
                          title="Edit skill name"
                          className="opacity-0 group-hover/badge:opacity-100 text-muted-foreground hover:text-primary transition-opacity cursor-pointer"
                        >
                          <Edit2 className="size-2.5" />
                        </button>

                        {/* Delete Single Skill Tag Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteIndividualSkill(g, idx)}
                          title={`Delete "${item}"`}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/15 rounded-full p-0.5 transition-colors cursor-pointer"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Quick Add Single Skill Input ── */}
              <div className="mt-4 pt-3 border-t border-border/40">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddIndividualSkill(g);
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="+ Add skill (e.g. Docker, GraphQL)..."
                      value={quickAddInput[g.id] || ""}
                      onChange={(e) =>
                        setQuickAddInput({
                          ...quickAddInput,
                          [g.id]: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-border/80 bg-background/80 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:bg-background focus:outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      !quickAddInput[g.id]?.trim() ||
                      addingSkillToGroup === g.id
                    }
                    className="inline-flex items-center gap-1 rounded-xl bg-surface-elevated border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                  >
                    {addingSkillToGroup === g.id ? (
                      <Loader2 className="size-3 animate-spin text-primary" />
                    ) : (
                      <Plus className="size-3.5 text-primary" />
                    )}
                    <span>Add</span>
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
