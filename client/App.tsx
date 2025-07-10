import "./global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home, Palette, Download, Eye, Layers, Moon, Sun } from "lucide-react";
import Index from "./pages/Index";
import Tokens from "./pages/Tokens";
import Components from "./pages/Components";
import Automation from "./pages/Automation";
import NotFound from "./pages/NotFound";

// Navigation Component
function Navigation({
  darkMode,
  toggleDarkMode,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-app-bar border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Design System</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <a
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/")
                  ? "bg-primary/10 text-primary"
                  : "text-app-bar-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Home className="w-4 h-4" />
              Overview
            </a>
            <a
              href="/tokens"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/tokens")
                  ? "bg-primary/10 text-primary"
                  : "text-app-bar-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Eye className="w-4 h-4" />
              Tokens
            </a>
            <a
              href="/components"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/components")
                  ? "bg-primary/10 text-primary"
                  : "text-app-bar-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Layers className="w-4 h-4" />
              Components
            </a>
            <a
              href="/automation"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/automation")
                  ? "bg-primary/10 text-primary"
                  : "text-app-bar-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Download className="w-4 h-4" />
              Automation
            </a>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-app-bar-foreground hover:bg-accent hover:text-accent-foreground ml-2"
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// App Component
function App() {
  // Dark mode state management
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply dark mode class to document and save to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="pb-safe-bottom">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tokens" element={<Tokens />} />
            <Route path="/components" element={<Components />} />
            <Route path="/automation" element={<Automation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

// Mount the app
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
