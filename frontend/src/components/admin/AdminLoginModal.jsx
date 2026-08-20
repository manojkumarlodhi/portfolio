import React, { useState } from "react";
import { Lock, Mail, ShieldCheck, X, Loader2 } from "lucide-react";
import { authApi } from "../../api/authApi";

export function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authApi.login(email.trim().toLowerCase(), password);
      const { accessToken, refreshToken } = res.data?.data || {};

      if (!accessToken) {
        throw new Error("No access token returned from server");
      }

      // Persist tokens securely
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken || "");

      setPassword("");
      setEmail("");
      onLoginSuccess();
    } catch (err) {
      let serverMessage = err.response?.data?.message;
      if (!serverMessage) {
        if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
          serverMessage = "Server connection timed out. Server might be waking up (Cold Start) — please try again in a few seconds.";
        } else if (err.message === "Network Error") {
          serverMessage = "Cannot connect to server. Please check backend URL and server status.";
        } else {
          serverMessage = err.message || "Invalid Email or Password. Please try again.";
        }
      }
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-rise">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-primary/15 p-3 text-primary">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <h2 className="text-xl font-bold font-display">Admin Portal Login</h2>
            <p className="text-xs text-muted-foreground">Sign in with Admin Credentials</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Admin Email</label>
            <div className="relative mt-1">
              <input
                type="email"
                required
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pl-10 text-sm text-foreground focus:border-primary focus:outline-none"
              />
              <Mail className="absolute top-3 left-3 size-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground">Password</label>
            <div className="relative mt-1">
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pl-10 text-sm text-foreground focus:border-primary focus:outline-none"
              />
              <Lock className="absolute top-3 left-3 size-4 text-muted-foreground" />
            </div>
            {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-[1.02] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Signing in..." : "Login to Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
