import { useState, useEffect } from "react";
import {
  Palette,
  Type,
  Ruler,
  Smartphone,
  Download,
  Upload,
  GitBranch,
  Search,
  Eye,
  Code2,
  Figma,
  ArrowRight,
  Activity,
  Users,
  Zap,
} from "lucide-react";
import { TokenStore, mockTokens } from "@/lib/tokens";
import { TokenGrid } from "@/components/design-system/TokenDisplay";

export default function Index() {
  const [recentTokens, setRecentTokens] = useState(mockTokens.slice(0, 6));
  const [stats] = useState({
    totalTokens: mockTokens.length,
    colorTokens: mockTokens.filter((t) => t.type === "color").length,
    typographyTokens: mockTokens.filter(
      (t) =>
        t.type === "fontSize" ||
        t.type === "fontWeight" ||
        t.type === "fontFamily",
    ).length,
    spacingTokens: mockTokens.filter((t) => t.type === "spacing").length,
  });

  useEffect(() => {
    TokenStore.setTokens(mockTokens);
  }, []);

  const quickActions = [
    {
      icon: Upload,
      title: "Import from Figma",
      description: "Sync tokens via Token Studio",
      href: "/import",
      color: "bg-primary",
    },
    {
      icon: Download,
      title: "Export Tokens",
      description: "Generate iOS & Android code",
      href: "/export",
      color: "bg-accent",
    },
    {
      icon: Eye,
      title: "Preview Components",
      description: "View component examples",
      href: "/components",
      color: "bg-success",
    },
    {
      icon: Code2,
      title: "Documentation",
      description: "Implementation guides",
      href: "/docs",
      color: "bg-warning",
    },
  ];

  const recentActivity = [
    {
      type: "import",
      message: "Imported 24 color tokens from Figma",
      time: "2 hours ago",
      icon: Figma,
    },
    {
      type: "export",
      message: "Generated Swift tokens for iOS",
      time: "1 day ago",
      icon: Smartphone,
    },
    {
      type: "update",
      message: "Updated spacing scale values",
      time: "2 days ago",
      icon: Ruler,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Design System
              </h1>
              <p className="text-muted-foreground mt-1">
                Shared tokens and components for iOS & Android
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="btn-primary flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Sync with Figma
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalTokens}
                </p>
                <p className="text-sm text-muted-foreground">Total Tokens</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.colorTokens}
                </p>
                <p className="text-sm text-muted-foreground">Colors</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Type className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.typographyTokens}
                </p>
                <p className="text-sm text-muted-foreground">Typography</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.spacingTokens}
                </p>
                <p className="text-sm text-muted-foreground">Spacing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="bg-card rounded-xl p-4 border border-border hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}
                  >
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Tokens */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Recent Tokens
              </h2>
              <a
                href="/tokens"
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                View All
              </a>
            </div>
            <TokenGrid tokens={recentTokens} platform="web" />
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-4 border border-border"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <activity.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Platform Status */}
            <div className="mt-6 bg-card rounded-xl p-4 border border-border">
              <h3 className="font-medium text-foreground mb-3">
                Platform Status
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    iOS Tokens
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-xs text-success">Synced</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Android Tokens
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-xs text-success">Synced</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Figma Sync
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    <span className="text-xs text-warning">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
