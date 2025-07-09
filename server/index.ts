import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
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

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Token sync routes
  app.post("/api/sync/figma", handleFigmaSync);
  app.get("/api/sync/status", handleSyncStatus);
  app.get("/api/tokens/validate", handleTokenValidation);

  // Automation routes
  app.post("/api/automation/sync", handleTokenSync);
  app.post("/api/automation/webhook/figma", handleFigmaWebhook);
  app.post("/api/automation/manual", handleManualSync);
  app.get("/api/automation/status", handleAutomationStatus);

  return app;
}
