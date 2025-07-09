import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {
  Home,
  Palette,
  Download,
  Upload,
  Book,
  Eye,
  Settings,
} from "lucide-react";
import Index from "./pages/Index";
import Tokens from "./pages/Tokens";
import Export from "./pages/Export";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Navigation Component
function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Overview" },
    { path: "/tokens", icon: Palette, label: "Tokens" },
    { path: "/export", icon: Download, label: "Export" },
    { path: "/import", icon: Upload, label: "Import" },
    { path: "/components", icon: Eye, label: "Components" },
    { path: "/docs", icon: Book, label: "Documentation" },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">Design System</span>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </a>
              );
            })}
          </div>

          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}

// App Layout Component
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {children}
    </div>
  );
}

// Placeholder Pages
function ImportPage() {
  return (
    <AppLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Import from Figma
        </h1>
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Token Studio Integration
          </h3>
          <p className="text-muted-foreground mb-4">
            Connect your Figma file via Token Studio to automatically sync
            design tokens
          </p>
          <button className="btn-primary">Setup Token Studio Sync</button>
        </div>
      </div>
    </AppLayout>
  );
}

function ComponentsPage() {
  return (
    <AppLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Components</h1>
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Eye className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Component Library
          </h3>
          <p className="text-muted-foreground">
            Interactive component examples and implementation guides coming soon
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

function DocsPage() {
  return (
    <AppLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Documentation
        </h1>
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Book className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Implementation Guides
          </h3>
          <p className="text-muted-foreground">
            Comprehensive documentation for implementing the design system
            across platforms
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AppLayout>
                <Index />
              </AppLayout>
            }
          />
          <Route
            path="/tokens"
            element={
              <AppLayout>
                <Tokens />
              </AppLayout>
            }
          />
          <Route
            path="/export"
            element={
              <AppLayout>
                <Export />
              </AppLayout>
            }
          />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/docs" element={<DocsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route
            path="*"
            element={
              <AppLayout>
                <NotFound />
              </AppLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
