// ─── Projects Section ─────────────────────────────────────────────────────────
import React, { useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { SectionHeading, Chip } from "./shared";

const filters = ["All", "Full Stack", "Java Backend", "React Apps"];

export function Projects() {
  const { projects } = usePortfolio();
  const [active, setActive] = useState("All");

  const visible = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.category === active)),
    [active, projects]
  );

  return (
    <section id="projects" className="scroll-mt-24 bg-surface-elevated/40 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Projects"
          title="Things I have built"
          description="Featured work first. Links are honest — private repositories are marked as such."
        />

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                active === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <article key={p.id || p.title} className="surface-card flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-xs text-accent">{p.category}</span>
                {p.featured && (
                  <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-lg leading-snug font-bold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
              <ul className="mt-4 space-y-2">
                {(p.features || []).map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {(p.tech || []).map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-xs">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Lock className="size-3.5" />
                  {p.repo === "private" ? "Private repository" : "Public repository"}
                </span>
                <span className="text-muted-foreground">
                  {p.demo === "none" ? "No live demo" : "Live demo"}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
