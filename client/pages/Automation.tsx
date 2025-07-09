import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Pause,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  GitBranch,
  Smartphone,
  Monitor,
  Github,
  Figma,
  Zap,
} from "lucide-react";

interface AutomationStatus {
  automation: {
    enabled: boolean;
    lastSync: string;
    nextScheduled: string;
    repos: {
      ios: string;
      android: string;
    };
    webhookEnabled: boolean;
  };
  status: string;
}

export default function Automation() {
  const [status, setStatus] = useState<AutomationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await fetch("/api/automation/status");
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Failed to load automation status:", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerManualSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch("/api/automation/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Sync triggered:", result);
        // Refresh status
        await loadStatus();
      }
    } catch (error) {
      console.error("Failed to trigger sync:", error);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading automation status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Design System Automation
              </h1>
              <p className="text-gray-600 mt-1">
                Automated sync to iOS and Android applications
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/export"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Manual Export
              </Link>
              <button
                onClick={triggerManualSync}
                disabled={syncing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {syncing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Sync Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  status?.automation.enabled
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {status?.automation.enabled ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Automation Status
                </h3>
                <p
                  className={`text-sm ${
                    status?.automation.enabled
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {status?.automation.enabled ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {status?.automation.enabled
                ? "Tokens will sync automatically when changed"
                : "Manual sync only - configure GitHub token to enable automation"}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Last Sync</h3>
                <p className="text-sm text-gray-600">
                  {status?.automation.lastSync
                    ? new Date(status.automation.lastSync).toLocaleString()
                    : "Never"}
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Next scheduled:{" "}
              {status?.automation.nextScheduled
                ? new Date(status.automation.nextScheduled).toLocaleString()
                : "Not scheduled"}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  status?.automation.webhookEnabled
                    ? "bg-purple-100 text-purple-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Webhook</h3>
                <p
                  className={`text-sm ${
                    status?.automation.webhookEnabled
                      ? "text-purple-600"
                      : "text-gray-600"
                  }`}
                >
                  {status?.automation.webhookEnabled
                    ? "Configured"
                    : "Not configured"}
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {status?.automation.webhookEnabled
                ? "Figma changes trigger automatic sync"
                : "Configure webhook for automatic Figma sync"}
            </p>
          </div>
        </div>

        {/* Connected Repositories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Connected Repositories
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">iOS App</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Github className="w-4 h-4" />
                    {status?.automation.repos.ios || "Not configured"}
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">
                    DesignSystemLightColors.swift
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">
                    DesignSystemDarkColors.swift
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Android App</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Github className="w-4 h-4" />
                    {status?.automation.repos.android || "Not configured"}
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">design_colors.xml</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">DesignSystemColors.kt</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Automation Workflow
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Figma className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Design</h3>
              <p className="text-sm text-gray-600">
                Update tokens in Figma using Token Studio plugin
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <GitBranch className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Sync</h3>
              <p className="text-sm text-gray-600">
                Design system automatically detects changes
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Generate</h3>
              <p className="text-sm text-gray-600">
                Platform-specific code is generated automatically
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Github className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">4. Deploy</h3>
              <p className="text-sm text-gray-600">
                Code is committed to iOS and Android repos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
