// Shared UI helpers used across portfolio section components

export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-muted-foreground">{description}</p>}
    </div>
  );
}

export function Chip({ children }) {
  return (
    <span className="rounded-full border border-border bg-background/40 px-3 py-1 font-mono text-xs text-muted-foreground">
      {children}
    </span>
  );
}
