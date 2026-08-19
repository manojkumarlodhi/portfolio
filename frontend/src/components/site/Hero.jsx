import React from "react";
import { ArrowRight, FileText, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { formatUrl } from "../../lib/utils";

export function Hero() {
  const { profile, stats, photoUrl, orbitOuter, orbitInner, resumeDataUrl } = usePortfolio();

  const resumeHref = resumeDataUrl || formatUrl(profile.resumeUrl);
  const resumeIsDataUrl = resumeDataUrl?.startsWith("data:");

  return (
    <section id="top" className="hero-glow relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[1.15fr_0.85fr]">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            Open to Java Full Stack roles
          </span>

          <h1 className="mt-6 text-4xl leading-[1.05] font-bold sm:text-5xl md:text-6xl">
            {profile.name}
            <span className="mt-2 block text-gradient">{profile.role}</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {profile.tagline} Currently building the{" "}
            <span className="font-semibold text-foreground">Coding Arena</span> module of the Smart
            Education Platform at Dollop Infotech.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.03]"
            >
              Contact me
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={resumeHref}
              target={resumeIsDataUrl ? undefined : "_blank"}
              rel="noreferrer"
              download={resumeIsDataUrl ? "Manoj_Lodhi_Resume.pdf" : undefined}
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
            >
              <FileText className="size-4" />
              Resume
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
            >
              View projects
            </a>
            <div className="flex items-center gap-2">
              {[
                { href: formatUrl(profile.github), icon: Github, label: "GitHub", target: "_blank" },
                { href: formatUrl(profile.linkedin), icon: Linkedin, label: "LinkedIn", target: "_blank" },
                {
                  href: `mailto:${profile.email}`,
                  icon: Mail,
                  label: "Gmail",
                  target: undefined,
                },
              ].map(({ href, icon: Icon, label, target }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label === "Gmail" ? `Send email to ${profile.email}` : label}
                  target={target}
                  rel="noreferrer"
                  className="rounded-full border border-border p-3 text-muted-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.id || s.label} className="rounded-xl border border-border bg-surface-elevated p-4">
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
                <dd className="mt-1 font-display text-sm font-bold sm:text-base">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-rise justify-self-center [animation-delay:120ms]">
          <div className="relative grid size-[19rem] place-items-center sm:size-[23rem]">
            <div
              aria-hidden
              className="absolute inset-6 rounded-full opacity-50 blur-3xl [background:var(--gradient-primary)]"
            />

            {/* orbit rings */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-full border border-dashed border-border/70"
            />
            <div
              aria-hidden
              className="absolute inset-[3.25rem] rounded-full border border-border/50"
            />

            {/* outer orbit */}
            <div className="absolute inset-0 animate-orbit">
              {orbitOuter.map((t, i) => (
                <span
                  key={t.name || t.id}
                  className="absolute top-1/2 left-1/2 size-11 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `rotate(${(360 / (orbitOuter.length || 1)) * i}deg) translate(var(--orbit-r)) rotate(-${(360 / (orbitOuter.length || 1)) * i}deg)`,
                  }}
                >
                  <span className="animate-orbit-reverse grid size-11 place-items-center rounded-full border border-border bg-background/90 font-mono text-[0.6rem] font-bold text-primary shadow-[var(--shadow-card)] backdrop-blur">
                    {t.shortLabel || t.short || t.name}
                  </span>
                </span>
              ))}
            </div>

            {/* inner orbit */}
            <div className="animate-orbit-slow absolute inset-[3.25rem]">
              {orbitInner.map((t, i) => (
                <span
                  key={t.name || t.id}
                  className="absolute top-1/2 left-1/2 size-9 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `rotate(${(360 / (orbitInner.length || 1)) * i + 30}deg) translate(var(--orbit-r-inner)) rotate(-${(360 / (orbitInner.length || 1)) * i + 30}deg)`,
                  }}
                >
                  <span className="animate-orbit-slow-reverse grid size-9 place-items-center rounded-full border border-border bg-surface-elevated font-mono text-[0.55rem] font-bold text-accent shadow-[var(--shadow-card)]">
                    {t.shortLabel || t.short || t.name}
                  </span>
                </span>
              ))}
            </div>

            {/* photo / monogram */}
            <div className="relative size-44 overflow-hidden rounded-full border-2 border-primary/40 bg-surface-elevated shadow-[var(--shadow-elegant)] sm:size-52">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={`Portrait of ${profile.name}`}
                  loading="eager"
                  className="size-full object-cover"
                />
              ) : (
                <div className="grid size-full place-items-center [background:var(--gradient-primary)]">
                  <span className="font-display text-6xl font-bold text-primary-foreground tracking-widest">
                    {profile.monogram || (profile.name ? profile.name.split(" ").map(n => n[0]).join("") : "ML")}
                  </span>
                </div>
              )}
            </div>

            <div className="absolute -bottom-2 left-1/2 w-max -translate-x-1/2 rounded-full border border-border bg-background/90 px-4 py-2 text-xs font-medium backdrop-blur">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-3.5 text-primary" />
                {profile.location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
