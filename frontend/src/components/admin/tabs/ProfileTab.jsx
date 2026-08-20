// ─── Admin Profile Tab ────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  FileText,
  ImageOff,
  Loader2,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { profileApi, uploadApi } from "../../../api/portfolioApi";

export function ProfileTab({ isOpen }) {
  const { profile, updateProfile, updatePhotoUrl, updateResumeDataUrl, refetch } =
    usePortfolio();

  const [form, setForm] = useState(profile || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Photo
  const [photoPreview, setPhotoPreview] = useState(profile?.photoUrl || "");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [deletingPhoto, setDeletingPhoto] = useState(false);
  const photoInputRef = useRef(null);

  // Resume
  const [resumeFileName, setResumeFileName] = useState(
    profile?.resumeUrl && profile.resumeUrl !== "#" && profile.resumeUrl.startsWith("http")
      ? profile.resumeUrl.split("/").pop().split("?")[0]
      : ""
  );
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const [deletingResume, setDeletingResume] = useState(false);
  const resumeInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && profile) {
      setForm(profile);
      setPhotoPreview(profile?.photoUrl || "");
      setResumeFileName(
        profile?.resumeUrl && profile.resumeUrl !== "#" && profile.resumeUrl.startsWith("http")
          ? profile.resumeUrl.split("/").pop().split("?")[0]
          : ""
      );
    }
  }, [isOpen, profile]);

  // ── Save Profile ────────────────────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      const payload = {
        ...form,
        photoUrl: form.photoUrl || (photoPreview && !photoPreview.startsWith("data:") ? photoPreview : profile?.photoUrl) || "",
        resumeUrl: form.resumeUrl || profile?.resumeUrl || "",
      };
      const res = await profileApi.update(payload);
      const updated = res.data?.data;
      updateProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  // ── Photo Upload ────────────────────────────────────────────────────────────
  const handlePhotoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError("Image must be smaller than 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);

    setUploadingPhoto(true);
    setPhotoError("");
    try {
      const res = await uploadApi.uploadPhoto(file);
      const updated = res.data?.data;
      const newUrl = updated?.photoUrl;
      updatePhotoUrl(newUrl);
      setPhotoPreview(newUrl);
      setForm((prev) => ({ ...prev, photoUrl: newUrl }));
      await refetch();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Photo upload failed. Check Cloudinary config.";
      setPhotoError(msg);
      setPhotoPreview(profile?.photoUrl || "");
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const handleDeletePhoto = async () => {
    if (!window.confirm("Remove profile photo? Your monogram initials will be shown instead.")) return;
    setDeletingPhoto(true);
    setPhotoError("");
    try {
      await profileApi.deletePhoto();
      updatePhotoUrl(null);
      setPhotoPreview("");
      setForm((prev) => ({ ...prev, photoUrl: "" }));
      await refetch();
    } catch (err) {
      setPhotoError(err.response?.data?.message || "Failed to remove photo.");
    } finally {
      setDeletingPhoto(false);
    }
  };

  // ── Resume Upload ───────────────────────────────────────────────────────────
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setResumeError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setResumeError("PDF must be smaller than 25 MB.");
      return;
    }

    setResumeFileName(file.name);
    setUploadingResume(true);
    setResumeError("");
    try {
      const res = await uploadApi.uploadResume(file);
      const updated = res.data?.data;
      const newUrl = updated?.resumeUrl;
      updateResumeDataUrl(newUrl);
      setForm((prev) => ({ ...prev, resumeUrl: newUrl }));
      await refetch();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Resume upload failed. Check Cloudinary config.";
      setResumeError(msg);
      setResumeFileName("");
    } finally {
      setUploadingResume(false);
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm("Remove uploaded resume? The Resume URL fallback field will be used instead.")) return;
    setDeletingResume(true);
    setResumeError("");
    try {
      await profileApi.deleteResume();
      updateResumeDataUrl(null);
      setResumeFileName("");
      setForm((prev) => ({ ...prev, resumeUrl: "" }));
      await refetch();
    } catch (err) {
      setResumeError(err.response?.data?.message || "Failed to remove resume.");
    } finally {
      setDeletingResume(false);
    }
  };

  if (!form) return null;

  const hasPhoto = !!photoPreview;
  const hasResume =
    !!resumeFileName ||
    (form.resumeUrl && form.resumeUrl !== "#" && form.resumeUrl.startsWith("http"));

  return (
    <form onSubmit={handleSaveProfile} className="space-y-4 sm:space-y-5 animate-rise max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-display">Edit Profile &amp; Hero Information</h3>
          <p className="text-xs text-muted-foreground">Changes saved directly to MySQL database</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 sm:py-2 text-xs font-semibold text-primary-foreground cursor-pointer shadow-md hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-primary/20 p-3 text-xs text-primary">
          <Check className="size-4 shrink-0" /> Profile saved to database successfully!
        </div>
      )}
      {saveError && (
        <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive">
          <AlertTriangle className="size-4 shrink-0" /> {saveError}
        </div>
      )}

      {/* Name / Role / Monogram */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {[
          ["Full Name", "name", "text"],
          ["Role Title", "role", "text"],
          ["Monogram (2-3 letters)", "monogram", "text"],
        ].map(([label, key, type]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-muted-foreground">{label}</label>
            <input
              type={type}
              maxLength={key === "monogram" ? 4 : undefined}
              value={form[key] || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground">Tagline</label>
        <input
          type="text"
          value={form.tagline || ""}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
        />
      </div>

      {/* Summary */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground">Summary (About Me)</label>
        <textarea
          rows={4}
          value={form.summary || ""}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
        />
      </div>

      {/* Location / Email / Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {[
          ["Location", "location", "text"],
          ["Email", "email", "email"],
          ["Phone", "phone", "text"],
        ].map(([label, key, type]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-muted-foreground">{label}</label>
            <input
              type={type}
              value={form[key] || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* GitHub / LinkedIn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {[
          ["GitHub URL", "github"],
          ["LinkedIn URL", "linkedin"],
        ].map(([label, key]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-muted-foreground">{label}</label>
            <input
              type="text"
              value={form[key] || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* Resume URL (fallback) */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground">
          Resume URL — Fallback Link (Google Drive / Direct PDF link)
        </label>
        <input
          type="text"
          placeholder="https://drive.google.com/file/..."
          value={form.resumeUrl && form.resumeUrl !== "#" ? form.resumeUrl : ""}
          onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
        />
        <p className="mt-1 text-[0.65rem] text-muted-foreground">
          Used when no PDF is uploaded to Cloudinary above.
        </p>
      </div>

      {/* ── Resume PDF Upload Card ── */}
      <div className="surface-card p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs sm:text-sm font-bold font-display">Upload Resume PDF</h4>
            <p className="text-[0.7rem] sm:text-xs text-muted-foreground mt-0.5">
              Stored on Cloudinary CDN — becomes the Resume button download link
            </p>
          </div>
          {hasResume && (
            <button
              type="button"
              onClick={handleDeleteResume}
              disabled={deletingResume}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 cursor-pointer disabled:opacity-60 transition-colors w-full sm:w-auto"
            >
              {deletingResume ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
              {deletingResume ? "Removing..." : "Delete Resume"}
            </button>
          )}
        </div>

        {resumeError && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive">
            <AlertTriangle className="size-3.5 shrink-0" /> {resumeError}
          </div>
        )}

        {hasResume ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-primary/40 bg-primary/5 px-4 py-3">
            <FileText className="size-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary">
                {uploadingResume ? "Uploading to Cloudinary…" : "✓ Resume PDF Uploaded"}
              </p>
              <p className="truncate text-[0.65rem] text-muted-foreground">
                {resumeFileName || form.resumeUrl?.split("/").pop()?.split("?")[0] || ""}
              </p>
            </div>
            {uploadingResume ? (
              <Loader2 className="size-4 animate-spin text-primary shrink-0" />
            ) : (
              <label className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors w-full sm:w-auto shrink-0">
                <Upload className="size-3.5" /> Replace
                <input ref={resumeInputRef} type="file" accept="application/pdf" onChange={handleResumeUpload} className="hidden" />
              </label>
            )}
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col sm:flex-row items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-background px-4 sm:px-5 py-5 sm:py-6 text-xs sm:text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
            {uploadingResume ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5 shrink-0 text-primary" />}
            <div className="text-center sm:text-left">
              <p className="font-semibold">{uploadingResume ? "Uploading to Cloudinary..." : "Click to upload PDF resume"}</p>
              <p className="text-[0.65rem] sm:text-xs text-muted-foreground mt-0.5">PDF only • Max 25 MB • Cloudinary CDN</p>
            </div>
            <input ref={resumeInputRef} type="file" accept="application/pdf" onChange={handleResumeUpload} className="hidden" disabled={uploadingResume} />
          </label>
        )}
      </div>

      {/* ── Profile Photo Card ── */}
      <div className="surface-card p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs sm:text-sm font-bold font-display">Profile Photo</h4>
            <p className="text-[0.7rem] sm:text-xs text-muted-foreground mt-0.5">
              Displayed in Hero orbit — stored on Cloudinary CDN
            </p>
          </div>
          {hasPhoto && (
            <button
              type="button"
              onClick={handleDeletePhoto}
              disabled={deletingPhoto}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 cursor-pointer disabled:opacity-60 transition-colors w-full sm:w-auto"
            >
              {deletingPhoto ? <Loader2 className="size-3.5 animate-spin" /> : <ImageOff className="size-3.5" />}
              {deletingPhoto ? "Removing..." : "Delete Photo"}
            </button>
          )}
        </div>

        {photoError && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive">
            <AlertTriangle className="size-3.5 shrink-0" /> {photoError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Preview */}
          <div className="relative size-20 sm:size-24 shrink-0 overflow-hidden rounded-full border-2 border-primary/50 bg-background shadow-md">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile preview" className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center [background:var(--gradient-primary)] text-primary-foreground font-bold text-xl sm:text-2xl tracking-widest">
                {form.monogram || (form.name ? form.name.split(" ").map((n) => n[0]).join("") : "ML")}
              </div>
            )}
            {uploadingPhoto && (
              <div className="absolute inset-0 grid place-items-center bg-black/60 rounded-full">
                <Loader2 className="size-6 animate-spin text-white" />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex-1 w-full space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground">
                Photo URL (paste direct link — OR upload file below)
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  value={photoPreview.startsWith("data:") ? "" : photoPreview}
                  onChange={(e) => {
                    setPhotoPreview(e.target.value);
                    setForm((prev) => ({ ...prev, photoUrl: e.target.value }));
                  }}
                  className="flex-1 min-w-0 rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
                {photoPreview && (
                  <button
                    type="button"
                    title="Clear URL"
                    onClick={() => {
                      setPhotoPreview("");
                      setForm((prev) => ({ ...prev, photoUrl: "" }));
                    }}
                    className="rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-elevated border border-border px-4 py-2 text-xs font-semibold text-foreground hover:border-primary cursor-pointer transition-colors w-full sm:w-auto">
                {uploadingPhoto ? <Loader2 className="size-3.5 text-primary animate-spin" /> : <Upload className="size-3.5 text-primary" />}
                <span>{uploadingPhoto ? "Uploading to Cloudinary..." : "Upload Image to Cloudinary"}</span>
                <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoFileUpload} className="hidden" disabled={uploadingPhoto} />
              </label>
              <span className="text-[0.65rem] text-muted-foreground text-center sm:text-left">JPG, PNG, WebP • Max 10 MB</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
