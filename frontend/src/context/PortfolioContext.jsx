import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { initialData } from "../data/initialData";
import { portfolioApi } from "../api/portfolioApi";

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem("cached_portfolio_data");
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {}
    return initialData;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch full portfolio from backend on mount ─────────────────────────────
  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await portfolioApi.getPortfolio();
      const serverData = res.data?.data;
      if (serverData) {
        const freshData = {
          profile: serverData.profile || initialData.profile,
          photoUrl: serverData.profile?.photoUrl || null,
          orbitOuter: serverData.orbitOuter || initialData.orbitOuter,
          orbitInner: serverData.orbitInner || initialData.orbitInner,
          stats: serverData.stats || initialData.stats,
          skillGroups: serverData.skillGroups || initialData.skillGroups,
          experience: serverData.experience || initialData.experience,
          projects: serverData.projects || initialData.projects,
          education: serverData.education || initialData.education,
          messages: [],
        };
        setData(freshData);
        try {
          localStorage.setItem("cached_portfolio_data", JSON.stringify(freshData));
        } catch (e) {}
      }
    } catch (err) {
      console.warn("Backend unreachable, using local fallback data:", err.message);
      setError("Backend offline — showing cached/local data");
      // Keep existing data or cached data instead of hard resetting to initialData
      setData((prev) => {
        if (prev && prev.profile && prev.profile.name) {
          return prev;
        }
        return initialData;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();

    // Listen for forced portfolio refresh events (e.g. after admin saves)
    window.addEventListener("portfolio:refresh", fetchPortfolio);
    return () => window.removeEventListener("portfolio:refresh", fetchPortfolio);
  }, [fetchPortfolio]);

  // ── Optimistic local setters (used after API calls in admin tabs) ──────────
  const updateProfile = (updatedProfile) =>
    setData((prev) => ({ ...prev, profile: { ...prev.profile, ...updatedProfile } }));

  const updatePhotoUrl = (url) =>
    setData((prev) => ({ ...prev, photoUrl: url, profile: { ...prev.profile, photoUrl: url } }));

  const updateResumeDataUrl = (url) =>
    setData((prev) => ({ ...prev, profile: { ...prev.profile, resumeUrl: url } }));

  const updateStats = (newStats) =>
    setData((prev) => ({ ...prev, stats: newStats }));

  // Projects
  const addProject = (project) =>
    setData((prev) => ({ ...prev, projects: [project, ...prev.projects] }));
  const updateProject = (id, fields) =>
    setData((prev) => ({ ...prev, projects: prev.projects.map((p) => p.id === id ? { ...p, ...fields } : p) }));
  const deleteProject = (id) =>
    setData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));

  // Experience
  const addExperience = (exp) =>
    setData((prev) => ({ ...prev, experience: [exp, ...prev.experience] }));
  const updateExperience = (id, fields) =>
    setData((prev) => ({ ...prev, experience: prev.experience.map((e) => e.id === id ? { ...e, ...fields } : e) }));
  const deleteExperience = (id) =>
    setData((prev) => ({ ...prev, experience: prev.experience.filter((e) => e.id !== id) }));

  // Skill Groups
  const addSkillGroup = (group) =>
    setData((prev) => ({ ...prev, skillGroups: [...prev.skillGroups, group] }));
  const updateSkillGroup = (id, fields) =>
    setData((prev) => ({ ...prev, skillGroups: prev.skillGroups.map((g) => g.id === id ? { ...g, ...fields } : g) }));
  const deleteSkillGroup = (id) =>
    setData((prev) => ({ ...prev, skillGroups: prev.skillGroups.filter((g) => g.id !== id) }));

  // Education
  const addEducation = (edu) =>
    setData((prev) => ({ ...prev, education: [...prev.education, edu] }));
  const updateEducation = (id, fields) =>
    setData((prev) => ({ ...prev, education: prev.education.map((e) => e.id === id ? { ...e, ...fields } : e) }));
  const deleteEducation = (id) =>
    setData((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));

  // Messages (local display only — real data fetched in admin tab)
  const submitMessage = (msg) =>
    setData((prev) => ({ ...prev, messages: [{ ...msg, id: `msg-${Date.now()}`, isRead: false }, ...(prev.messages || [])] }));
  const deleteMessage = (id) =>
    setData((prev) => ({ ...prev, messages: (prev.messages || []).filter((m) => m.id !== id) }));

  // Orbit Items
  const addOrbitItem = (type, item) => {
    const key = type === "inner" ? "orbitInner" : "orbitOuter";
    setData((prev) => ({ ...prev, [key]: [...(prev[key] || []), item] }));
  };
  const updateOrbitItem = (type, id, fields) => {
    const key = type === "inner" ? "orbitInner" : "orbitOuter";
    setData((prev) => ({ ...prev, [key]: (prev[key] || []).map((o) => o.id === id ? { ...o, ...fields } : o) }));
  };
  const deleteOrbitItem = (type, id) => {
    const key = type === "inner" ? "orbitInner" : "orbitOuter";
    setData((prev) => ({ ...prev, [key]: (prev[key] || []).filter((o) => o.id !== id) }));
  };

  const resetToDefault = () => setData(initialData);

  return (
    <PortfolioContext.Provider
      value={{
        data,
        loading,
        error,
        refetch: fetchPortfolio,
        profile: data.profile,
        photoUrl: data.photoUrl || data.profile?.photoUrl,
        resumeDataUrl: data.profile?.resumeUrl || null,
        orbitOuter: data.orbitOuter || initialData.orbitOuter,
        orbitInner: data.orbitInner || initialData.orbitInner,
        stats: data.stats,
        skillGroups: data.skillGroups,
        experience: data.experience,
        projects: data.projects,
        education: data.education,
        messages: data.messages || [],
        updateProfile,
        updatePhotoUrl,
        updateResumeDataUrl,
        updateStats,
        addOrbitItem,
        updateOrbitItem,
        deleteOrbitItem,
        addProject,
        updateProject,
        deleteProject,
        addExperience,
        updateExperience,
        deleteExperience,
        addSkillGroup,
        updateSkillGroup,
        deleteSkillGroup,
        addEducation,
        updateEducation,
        deleteEducation,
        submitMessage,
        deleteMessage,
        resetToDefault,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
