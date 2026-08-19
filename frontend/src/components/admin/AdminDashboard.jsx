// ─── Admin Dashboard Shell ────────────────────────────────────────────────────
// Main shell: sidebar navigation + tab renderer only.
// All tab content lives in ./tabs/* for easy maintenance.
import React, { useState } from "react";
import {
  Briefcase,
  Code,
  FolderKanban,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LogOut,
  Orbit,
  RefreshCw,
  User,
  X,
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { authApi } from "../../api/authApi";
import { OverviewTab }   from "./tabs/OverviewTab";
import { ProfileTab }    from "./tabs/ProfileTab";
import { OrbitTab }      from "./tabs/OrbitTab";
import { ProjectsTab }   from "./tabs/ProjectsTab";
import { SkillsTab }     from "./tabs/SkillsTab";
import { ExperienceTab } from "./tabs/ExperienceTab";
import { EducationTab }  from "./tabs/EducationTab";
import { MessagesTab }   from "./tabs/MessagesTab";

export function AdminDashboard({ isOpen, onClose, onLogout }) {
  const { orbitOuter, orbitInner, projects, skillGroups, experience, education, messages, resetToDefault } = usePortfolio();

  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen) return null;

  const tabs = [
    { id: "overview",    label: "Overview",        icon: LayoutDashboard },
    { id: "profile",     label: "Profile & Photo", icon: User },
    { id: "orbit",       label: "Tech Orbit Rings",icon: Orbit,        count: orbitOuter.length + orbitInner.length },
    { id: "projects",    label: "Projects",         icon: FolderKanban, count: projects.length },
    { id: "skills",      label: "Skills",           icon: Code,         count: skillGroups.length },
    { id: "experience",  label: "Experience",       icon: Briefcase,    count: experience.length },
    { id: "education",   label: "Education",        icon: GraduationCap,count: education.length },
    { id: "messages",    label: "Messages Inbox",   icon: Inbox,        count: messages.length, badge: messages.length > 0 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md">
      <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">

        {/* ── Top Bar ── */}
        <header className="flex items-center justify-between border-b border-border bg-surface-elevated px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-primary/20 p-2 text-primary">
              <LayoutDashboard className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold font-display leading-none">Portfolio Admin Panel</h2>
              <span className="text-xs text-primary font-medium">Spring Boot 3 + MySQL Connected</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={async () => {
                const rt = localStorage.getItem("refreshToken");
                if (rt) {
                  try {
                    await authApi.logout(rt);
                  } catch { /* silent */ }
                }
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                if (onLogout) onLogout();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <LogOut className="size-3.5" /> Logout
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </header>

        {/* ── Dashboard Body ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar */}
          <aside className="w-56 border-r border-border bg-surface-elevated/50 p-3">
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon, count, badge }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </div>
                  {count !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                        badge
                          ? "bg-accent text-accent-foreground"
                          : activeTab === id
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-border text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Tab Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            {activeTab === "overview"   && <OverviewTab />}
            {activeTab === "profile"    && <ProfileTab isOpen={isOpen} />}
            {activeTab === "orbit"      && <OrbitTab />}
            {activeTab === "projects"   && <ProjectsTab />}
            {activeTab === "skills"     && <SkillsTab />}
            {activeTab === "experience" && <ExperienceTab />}
            {activeTab === "education"  && <EducationTab />}
            {activeTab === "messages"   && <MessagesTab />}
          </main>
        </div>

      </div>
    </div>
  );
}
