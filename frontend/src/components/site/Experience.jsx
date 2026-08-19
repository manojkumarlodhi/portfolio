// ─── Experience Section ───────────────────────────────────────────────────────
import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { SectionHeading, Chip } from "./shared";

export function Experience() {
  const { experience } = usePortfolio();

  return (
    <section id="experience" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <SectionHeading
        eyebrow="Experience"
        title="Work and training"
        description="Professional employment and formal training, kept clearly separate."
      />
      <div className="relative mt-12 space-y-8 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-border md:before:left-1/2">
        {experience.map((item, i) => (
          <article key={item.id || item.company} className="relative pl-8 md:pl-0">
            <span className="absolute top-6 left-0 size-4 rounded-full border-2 border-primary bg-background md:left-1/2 md:-translate-x-1/2" />
            <div
              className={`surface-card p-6 md:w-[calc(50%-2rem)] ${
                i % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    item.type === "Employment"
                      ? "bg-primary/15 text-primary"
                      : "bg-accent/15 text-accent"
                  }`}
                >
                  {item.type}
                </span>
                <span className="text-xs text-muted-foreground">{item.period}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold">{item.company}</h3>
              <p className="text-sm font-medium text-primary">{item.role}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{item.context}</p>
              <ul className="mt-4 space-y-2">
                {(item.points || []).map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {(item.tech || []).map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
