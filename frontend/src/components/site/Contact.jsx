// ─── Contact Section ──────────────────────────────────────────────────────────
import React, { useState } from "react";
import {
  CheckCircle2,
  FileText,
  Github,
  Linkedin,
  Loader2,
  Mail,
  Phone,
  Send,
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { formatUrl } from "../../lib/utils";
import { SectionHeading } from "./shared";
import { messageApi } from "../../api/portfolioApi";

export function Contact() {
  const { profile, resumeDataUrl } = usePortfolio();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await messageApi.submit(formData.name, formData.email, formData.message);
      setSent(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send message. Please try again.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Resume: if admin uploaded a PDF file (base64 dataUrl), use that for download
  // Otherwise fall back to the URL the admin pasted in profile.resumeUrl
  const resumeHref = resumeDataUrl || formatUrl(profile.resumeUrl);
  const resumeIsDataUrl = resumeDataUrl?.startsWith("data:");

  return (
    <section id="contact" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="hero-glow surface-card overflow-hidden p-8 md:p-14">
          <SectionHeading
            eyebrow="Contact"
            title="Let's build something solid"
            description="Open to Java Full Stack opportunities and freelance backend work."
          />

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Feel free to send a message directly via this form, or reach out through email or phone.
                Messages sent here are recorded live and viewable in the Admin Panel Inbox!
              </p>

              <div className="flex flex-col gap-3">
                {/* Email */}
                <a
                  href={`mailto:${profile.email}`}
                  title={`Send email to ${profile.email}`}
                  className="inline-flex items-center gap-3 rounded-xl border border-border bg-surface-elevated px-5 py-3.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary cursor-pointer"
                >
                  <Mail className="size-4 text-primary" />
                  <span>{profile.email}</span>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${profile.phone?.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-3 rounded-xl border border-border bg-surface-elevated px-5 py-3.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
                >
                  <Phone className="size-4 text-accent" />
                  <span>{profile.phone}</span>
                </a>

                {/* Resume Download */}
                <a
                  href={resumeHref}
                  target={resumeIsDataUrl ? undefined : "_blank"}
                  rel="noreferrer"
                  download={resumeIsDataUrl ? "Manoj_Lodhi_Resume.pdf" : undefined}
                  className="inline-flex items-center gap-3 rounded-xl border border-primary/50 bg-primary/10 px-5 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
                >
                  <FileText className="size-4" />
                  <span>Download / View Resume</span>
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                {[
                  {
                    href: `mailto:${profile.email}`,
                    icon: Mail,
                    label: "Gmail",
                    title: `Send Email to ${profile.email}`,
                    target: undefined,
                  },
                  { href: formatUrl(profile.github), icon: Github, label: "GitHub", title: "GitHub Profile", target: "_blank" },
                  { href: formatUrl(profile.linkedin), icon: Linkedin, label: "LinkedIn", title: "LinkedIn Profile", target: "_blank" },
                ].map(({ href, icon: Icon, label, title, target }) => (
                  <a
                    key={label}
                    href={href}
                    target={target}
                    rel="noreferrer"
                    aria-label={label}
                    title={title}
                    className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
                  >
                    <Icon className="size-4 text-primary" />
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Message Form */}
            <form onSubmit={handleSubmit} className="surface-card space-y-4 p-6">
              <h3 className="font-display text-base font-bold text-foreground">Send a Quick Message</h3>

              {sent && (
                <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs text-primary">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Your message has been sent successfully! I'll get back to you soon.</span>
                </div>
              )}
              {submitError && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                  {submitError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-muted-foreground">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground">Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Let's discuss a project or role..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.02] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                {submitting ? "Sending..." : "Submit Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
