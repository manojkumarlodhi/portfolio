// ─── Education Section ────────────────────────────────────────────────────────
import React from "react";
import { Award, GraduationCap } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { SectionHeading } from "./shared";

export function Education() {
  const { education } = usePortfolio();

  return (
    <section id="education" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <SectionHeading eyebrow="Education" title="Degree and certification" />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {education.map((e, i) => (
          <div key={e.id || e.title} className="surface-card p-7">
            <span className="inline-flex rounded-lg bg-primary/15 p-2.5 text-primary">
              {i === 0 ? <GraduationCap className="size-5" /> : <Award className="size-5" />}
            </span>
            <h3 className="mt-4 text-lg font-bold">{e.title}</h3>
            <p className="mt-1 text-sm text-primary">{e.org}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{e.meta}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
