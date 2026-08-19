// ─── About Section ───────────────────────────────────────────────────────────
import React from "react";
import { Briefcase, MonitorSmartphone, Sparkles } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { SectionHeading } from "./shared";

export function About() {
  const { profile } = usePortfolio();

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <SectionHeading eyebrow="About" title="From circuits to code" />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="surface-card p-7 md:col-span-2">
          <p className="leading-relaxed text-muted-foreground">{profile.summary}</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            I enjoy the backend side most — designing clean REST endpoints, securing them with
            Spring Security and JWT, and modelling data properly in MySQL. On the frontend I build
            responsive React interfaces that stay fast and readable.
          </p>
        </div>
        <div className="surface-card space-y-5 p-7">
          {[
            { icon: Briefcase, label: "Now", value: "Dollop Infotech Pvt. Ltd." },
            { icon: Sparkles, label: "Focus", value: "Spring Boot · REST · React" },
            { icon: MonitorSmartphone, label: "Base", value: profile.location },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="rounded-lg bg-primary/15 p-2 text-primary">
                <Icon className="size-4" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
