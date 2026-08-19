// ─── Footer ───────────────────────────────────────────────────────────────────
import React from "react";
import { FileText, Mail, ShieldCheck } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { formatUrl } from "../../lib/utils";

export function Footer({ onOpenAdmin }) {
  const { profile, resumeDataUrl } = usePortfolio();

  const resumeHref = resumeDataUrl || formatUrl(profile.resumeUrl);
  const resumeIsDataUrl = resumeDataUrl?.startsWith("data:");

  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted-foreground sm:flex-row">
        <p className="text-xs">
          © {new Date().getFullYear()} {profile.name}. All static data managed via Admin.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {/* Gmail */}
          <a
            href={`mailto:${profile.email}`}
            title={`Send email to ${profile.email}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <Mail className="size-3.5 text-primary" />
            <span>Gmail</span>
          </a>

          {/* Resume */}
          <a
            href={resumeHref}
            target={resumeIsDataUrl ? undefined : "_blank"}
            rel="noreferrer"
            download={resumeIsDataUrl ? "Manoj_Lodhi_Resume.pdf" : undefined}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <FileText className="size-3.5 text-accent" />
            <span>Resume</span>
          </a>

          {/* Admin Login */}
          <button
            type="button"
            onClick={onOpenAdmin}
            title="Open Admin Login"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
          >
            <ShieldCheck className="size-3.5 text-primary" />
            <span>Admin Login</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
