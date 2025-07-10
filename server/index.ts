import express from "express";
import cors from "cors";
import {
  handleFigmaSync,
  handleSyncStatus,
  handleTokenValidation,
} from "./routes/sync";
import {
  handleTokenSync,
  handleFigmaWebhook,
  handleManualSync,
  handleSyncStatus as handleAutomationStatus,
} from "./routes/automation";
import { handleTokenStats, handleTokenList } from "./routes/tokens";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "healthy",
      service: "Sonetel Mobile Design System",
      timestamp: new Date().toISOString(),
    });
  });

  // Simple ping for debugging
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "pong" });
  });

  // Token data routes
  app.get("/api/tokens/stats", handleTokenStats);
  app.get("/api/tokens/list", handleTokenList);

  // Token sync routes
  app.post("/api/sync/figma", handleFigmaSync);
  app.get("/api/sync/status", handleSyncStatus);
  app.get("/api/tokens/validate", handleTokenValidation);

  // Automation routes for mobile platform sync
  app.post("/api/automation/sync", handleTokenSync);
  app.post("/api/automation/webhook/figma", handleFigmaWebhook);
  app.post("/api/automation/manual", handleManualSync);
  app.get("/api/automation/status", handleAutomationStatus);

  return app;
}
