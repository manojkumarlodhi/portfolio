// ─── Admin Messages Inbox Tab ─────────────────────────────────────────────────
import React, { useEffect, useState, useCallback } from "react";
import { CheckCheck, Inbox, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { messageApi } from "../../../api/portfolioApi";

export function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterRead, setFilterRead] = useState("all");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        size: 20,
        ...(search.trim() && { search: search.trim() }),
        ...(filterRead !== "all" && { isRead: filterRead === "read" }),
      };
      const res = await messageApi.getAll(params);
      const data = res.data?.data;
      setMessages(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
    } catch (e) {
      setError("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }, [page, search, filterRead]);

  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (id, isRead) => {
    try {
      await messageApi.markAsRead(id, isRead);
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, isRead } : m));
    } catch { /* silent */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await messageApi.markAllAsRead();
      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
    } catch { /* silent */ }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await messageApi.delete(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setTotalElements((n) => n - 1);
    } catch { /* silent */ }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6 animate-rise">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="text-lg font-bold font-display">
            Inbox
            <span className="ml-2 text-sm font-normal text-muted-foreground">({totalElements} total)</span>
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-destructive px-2 py-0.5 text-[0.65rem] font-bold text-white">{unreadCount} unread</span>
            )}
          </h3>
          <p className="text-xs text-muted-foreground">Messages from visitors via Contact form</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary cursor-pointer">
              <CheckCheck className="size-3.5" /> Mark All Read
            </button>
          )}
          <button onClick={load} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary cursor-pointer">
            <RefreshCw className="size-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by name, email, message..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="flex-1 min-w-[220px] rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
        />
        <select
          value={filterRead}
          onChange={(e) => { setFilterRead(e.target.value); setPage(0); }}
          className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
          <Loader2 className="size-5 animate-spin" /> Loading messages...
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Empty */}
      {!loading && messages.length === 0 && (
        <div className="surface-card p-10 text-center text-muted-foreground">
          <Inbox className="mx-auto size-8 opacity-40" />
          <p className="mt-2 text-sm font-medium">No messages found.</p>
        </div>
      )}

      {/* Message List */}
      {!loading && messages.length > 0 && (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`surface-card p-5 transition-colors ${!m.isRead ? "border-primary/40 bg-primary/5" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!m.isRead && <span className="size-2 rounded-full bg-primary shrink-0" />}
                    <h4 className="text-sm font-bold text-foreground">{m.name}</h4>
                    <a href={`mailto:${m.email}`} className="text-xs text-primary underline truncate">{m.email}</a>
                  </div>
                  <p className="mt-0.5 text-[0.65rem] font-mono text-muted-foreground">
                    {m.createdAt ? new Date(m.createdAt).toLocaleString("en-IN") : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleMarkRead(m.id, !m.isRead)}
                    className="rounded px-2 py-1 text-[0.65rem] font-semibold text-muted-foreground hover:text-primary cursor-pointer border border-border"
                    title={m.isRead ? "Mark unread" : "Mark read"}
                  >
                    {m.isRead ? "Unread" : "Read"}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="rounded p-1 text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground bg-background/50 p-3 rounded-lg border border-border">
                "{m.message}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}
            className="rounded-xl border border-border px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            ← Prev
          </button>
          <span className="text-xs text-muted-foreground">Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}
            className="rounded-xl border border-border px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
