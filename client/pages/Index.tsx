import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Palette,
  Type,
  Ruler,
  Download,
  Smartphone,
  Monitor,
} from "lucide-react";

interface TokenStats {
  total: number;
  colors: number;
  typography: number;
  spacing: number;
  lastUpdated?: string;
}

export default function Index() {
  const [stats, setStats] = useState<TokenStats>({
    total: 0,
    colors: 0,
    typography: 0,
    spacing: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/tokens/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.log("Stats not available:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
          Sonetel Mobile Design System
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Shared design tokens and component specifications for Sonetel native
          iOS and Android apps. Exported from Figma using Token Studio and
          transformed to Swift and Kotlin using Style Dictionary.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        <div className="bg-card rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Total Tokens
            </span>
          </div>
          <p className="text-3xl font-bold">{loading ? "..." : stats.total}</p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Colors
            </span>
          </div>
          <p className="text-3xl font-bold">{loading ? "..." : stats.colors}</p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Type className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Typography
            </span>
          </div>
          <p className="text-3xl font-bold">
            {loading ? "..." : stats.typography}
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Ruler className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Spacing
            </span>
          </div>
          <p className="text-3xl font-bold">
            {loading ? "..." : stats.spacing}
          </p>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-card rounded-2xl p-8 shadow-sm border">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">iOS Integration</h3>
              <p className="text-muted-foreground">
                SwiftUI with adaptive colors
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Output Format</span>
              <span className="font-medium">Swift Extensions</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Dark Mode</span>
              <span className="font-medium">✅ Automatic</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sync Status</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-sm border">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Monitor className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Android Integration</h3>
              <p className="text-muted-foreground">
                Material 3 + Jetpack Compose
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Output Format</span>
              <span className="font-medium">XML + Kotlin</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Dark Mode</span>
              <span className="font-medium">✅ values-night</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sync Status</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/tokens"
          className="group bg-card rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Browse Tokens</h3>
              <p className="text-muted-foreground">
                View all design tokens for native iOS and Android
              </p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Palette className="w-5 h-5 text-primary" />
            </div>
          </div>
        </Link>

        <Link
          to="/components"
          className="group bg-card rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Mobile Components</h3>
              <p className="text-muted-foreground">
                Native iOS and Android component specifications
              </p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center group-hover:bg-success/20 transition-colors">
              <Type className="w-5 h-5 text-success" />
            </div>
          </div>
        </Link>

        <Link
          to="/automation"
          className="group bg-card rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Sync to Mobile Apps
              </h3>
              <p className="text-muted-foreground">
                Automatically sync tokens to iOS and Android projects
              </p>
            </div>
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <Download className="w-5 h-5 text-accent" />
            </div>
          </div>
        </Link>
      </div>

      {/* Info and Last Updated */}
      <div className="text-center mt-12 space-y-2">
        <p className="text-sm text-muted-foreground">
          Token counts are calculated from source design system files
        </p>
        {stats.lastUpdated && (
          <p className="text-sm text-muted-foreground">
            Last platform build: {new Date(stats.lastUpdated).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
