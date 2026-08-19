import React, { useState } from "react";
import { PortfolioProvider } from "./context/PortfolioContext";
import { Nav } from "./components/site/Nav";
import { Hero } from "./components/site/Hero";
import { About } from "./components/site/About";
import { Skills } from "./components/site/Skills";
import { Experience } from "./components/site/Experience";
import { Projects } from "./components/site/Projects";
import { Education } from "./components/site/Education";
import { Contact } from "./components/site/Contact";
import { Footer } from "./components/site/Footer";
import { AdminLoginModal } from "./components/admin/AdminLoginModal";
import { AdminDashboard } from "./components/admin/AdminDashboard";

function PortfolioApp() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleOpenAdminTrigger = () => {
    setIsLoginOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    setIsAdminOpen(true);
  };

  const handleLogout = () => {
    setIsAdminOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav onOpenAdmin={handleOpenAdminTrigger} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer onOpenAdmin={handleOpenAdminTrigger} />

      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
