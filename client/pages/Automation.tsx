import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Smartphone,
  Monitor,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  GitBranch,
} from "lucide-react";

interface SyncStatus {
  lastSync: string;
  status: string;
  tokensCount: number;
}

export default function Automation() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

  useEffect(() => {
    loadSyncStatus();
  }, []);

  const loadSyncStatus = async () => {
    try {
      const response = await fetch("/api/automation/status");
      if (response.ok) {
        const data = await response.json();
        setSyncStatus(data);
      }
    } catch (error) {
      console.error("Failed to load sync status:", error);
    }
  };

  const triggerManualSync = async () => {
    setSyncing(true);
    setLastSyncResult(null);

    try {
      const response = await fetch("/api/automation/manual", {
        method: "POST",
      });

      if (response.ok) {
        setLastSyncResult("✅ Sync completed successfully");
        await loadSyncStatus();
      } else {
        setLastSyncResult("❌ Sync failed");
      }
    } catch (error) {
      setLastSyncResult("❌ Sync failed: " + error.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Design System Automation</h1>
        <p className="text-muted-foreground">
          Manage token sync to iOS and Android projects
        </p>
      </div>

      {/* Sync Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Sync Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {syncStatus ? (
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Last Sync
                </div>
                <div className="font-medium">
                  {new Date(syncStatus.lastSync).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Status</div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-medium">{syncStatus.status}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Tokens Available
                </div>
                <div className="font-medium">{syncStatus.tokensCount}</div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">Loading status...</div>
          )}
        </CardContent>
      </Card>

      {/* Manual Sync */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Manual Sync
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Trigger a manual sync to update tokens in both iOS and Android
              projects. This will generate fresh tokens and create git branches
              with the changes.
            </p>

            <div className="flex items-center gap-4">
              <Button
                onClick={triggerManualSync}
                disabled={syncing}
                className="flex items-center gap-2"
              >
                {syncing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <GitBranch className="w-4 h-4" />
                )}
                {syncing ? "Syncing..." : "Sync All Platforms"}
              </Button>

              {lastSyncResult && (
                <div className="flex items-center gap-2">
                  {lastSyncResult.includes("✅") ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">{lastSyncResult}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Status */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              iOS Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target Path</span>
                <span className="font-mono text-xs">
                  ../sonetel-mobile-ios/Sonetel Mobile/DesignSystem/
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Files Generated</span>
                <span className="font-medium">Swift Extensions</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Update</span>
                <span className="font-medium text-green-600">
                  {syncStatus?.lastSync
                    ? new Date(syncStatus.lastSync).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-green-600" />
              Android Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target Path</span>
                <span className="font-mono text-xs">
                  ../sonetel-mobile-android/app/src/main/res/
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Files Generated</span>
                <span className="font-medium">XML + Kotlin</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Update</span>
                <span className="font-medium text-green-600">
                  {syncStatus?.lastSync
                    ? new Date(syncStatus.lastSync).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
