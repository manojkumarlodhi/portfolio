import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function apply(mode) {
  document.documentElement.classList.toggle("light", mode === "light");
}

export function ThemeToggle() {
  const [mode, setMode] = useState("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initial =
      stored ?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setMode(initial);
    apply(initial);
  }, []);

  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    apply(next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface-elevated text-muted-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
    >
      <Sun
        className={`absolute size-4 transition-all duration-300 ${
          mode === "light" ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
        }`}
      />
      <Moon
        className={`absolute size-4 transition-all duration-300 ${
          mode === "dark" ? "scale-100 rotate-0 opacity-100" : "scale-50 rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}
