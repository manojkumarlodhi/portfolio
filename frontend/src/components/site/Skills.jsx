// ─── Skills Section ───────────────────────────────────────────────────────────
import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { SectionHeading } from "./shared";

export function Skills() {
  const { skillGroups } = usePortfolio();

  return (
    <section id="skills" className="scroll-mt-24 bg-surface-elevated/40 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Skills"
          title="The stack I work with"
          description="Grouped the way I actually use them on a project."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <div key={group.id || group.title} className="surface-card p-6">
              <h3 className="font-display text-base font-bold text-primary">{group.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {(group.items || []).map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
