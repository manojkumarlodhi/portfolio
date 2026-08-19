// ─── Admin Overview Tab ───────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { Briefcase, Code, FolderKanban, Inbox, Loader2, RefreshCw } from "lucide-react";
import { dashboardApi } from "../../../api/portfolioApi";

export function OverviewTab() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.getOverview();
      setOverview(res.data?.data);
    } catch (e) {
      setError("Failed to load dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
      <Loader2 className="size-5 animate-spin" /> Loading dashboard...
    </div>
  );

  return (
    <div className="space-y-5 sm:space-y-6 animate-rise">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold font-display">Dashboard Overview</h3>
        <button onClick={load} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
          <RefreshCw className="size-3.5" /> Refresh
        </button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Projects", val: overview?.totalProjects ?? "—", icon: FolderKanban, color: "text-primary" },
          { label: "Skill Categories", val: overview?.totalSkillGroups ?? "—", icon: Code, color: "text-accent" },
          { label: "Experience Entries", val: overview?.totalExperience ?? "—", icon: Briefcase, color: "text-primary" },
          { label: "Inbox Messages", val: overview?.totalMessages ?? "—", icon: Inbox, color: overview?.unreadMessages > 0 ? "text-destructive" : "text-accent" },
        ].map((card) => (
          <div key={card.label} className="surface-card p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{card.label}</span>
              <card.icon className={`size-4 ${card.color}`} />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-bold font-display">{card.val}</p>
          </div>
        ))}
      </div>

      {overview?.unreadMessages > 0 && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive font-semibold flex items-center gap-2">
          <span>📬</span>
          <span>{overview.unreadMessages} unread message{overview.unreadMessages > 1 ? "s" : ""} in inbox</span>
        </div>
      )}

      {overview?.profile && (
        <div className="surface-card p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-bold font-display">Active Profile (from DB)</h3>
          <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
            {[
              ["Name", overview.profile.name],
              ["Role", overview.profile.role],
              ["Location", overview.profile.location],
              ["Email", overview.profile.email],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-background/50 p-2.5 sm:p-3 border border-border/50">
                <span className="text-muted-foreground block text-[0.7rem] uppercase tracking-wider">{k}</span>
                <p className="font-semibold text-foreground text-xs sm:text-sm mt-0.5 break-words">{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
