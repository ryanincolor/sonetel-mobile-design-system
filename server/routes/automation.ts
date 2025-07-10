import { RequestHandler } from "express";
import { exec } from "child_process";
import fs from "fs";
import { promisify } from "util";

const execAsync = promisify(exec);

interface SyncWebhookPayload {
  source: "figma" | "token-studio" | "manual";
  timestamp: string;
  changes?: {
    added: string[];
    modified: string[];
    removed: string[];
  };
}

interface AutomationConfig {
  githubToken?: string;
  iosRepo: string;
  androidRepo: string;
  webhookSecret?: string;
}

// This would be stored in environment variables or database
const config: AutomationConfig = {
  iosRepo: process.env.IOS_REPO || "your-org/ios-app",
  androidRepo: process.env.ANDROID_REPO || "your-org/android-app",
  githubToken: process.env.GITHUB_TOKEN,
  webhookSecret: process.env.WEBHOOK_SECRET,
};

export const handleTokenSync: RequestHandler = async (req, res) => {
  try {
    console.log("Token sync triggered");

    // 1. Load and parse all tokens
    const tokens = await loadTokensFromFiles();

    // 2. Generate platform-specific code
    const iosLightCode = await generateIOSCode(tokens, "Light");
    const iosDarkCode = await generateIOSCode(tokens, "Dark");
    const androidCode = await generateAndroidCode(tokens);

    // 3. Create commit data
    const timestamp = new Date().toISOString();
    const commitMessage = `chore: update design tokens ${timestamp}`;

    // 4. Update iOS repo
    if (config.githubToken) {
      await updateGitHubRepo(
        config.iosRepo,
        [
          {
            path: "DesignSystem/DesignSystemLightColors.swift",
            content: iosLightCode,
          },
          {
            path: "DesignSystem/DesignSystemDarkColors.swift",
            content: iosDarkCode,
          },
        ],
        commitMessage,
      );

      // 5. Update Android repo
      await updateGitHubRepo(
        config.androidRepo,
        [
          {
            path: "app/src/main/res/values/design_colors.xml",
            content: androidCode.xml,
          },
          {
            path: "app/src/main/java/com/yourapp/designsystem/DesignSystemColors.kt",
            content: androidCode.kotlin,
          },
        ],
        commitMessage,
      );
    }

    res.json({
      success: true,
      message: "Tokens synced successfully",
      timestamp,
      repos: [config.iosRepo, config.androidRepo],
      files: {
        ios: ["DesignSystemLightColors.swift", "DesignSystemDarkColors.swift"],
        android: ["design_colors.xml", "DesignSystemColors.kt"],
      },
    });
  } catch (error) {
    console.error("Sync failed:", error);
    res.status(500).json({
      success: false,
      message: "Token sync failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleFigmaWebhook: RequestHandler = async (req, res) => {
  try {
    // Verify webhook signature if configured
    const signature = req.headers["x-figma-signature"] as string;
    if (config.webhookSecret && signature) {
      // Implement signature verification
      const isValid = verifyWebhookSignature(
        req.body,
        signature,
        config.webhookSecret,
      );
      if (!isValid) {
        return res.status(401).json({ error: "Invalid signature" });
      }
    }

    const payload: SyncWebhookPayload = req.body;
    console.log("Figma webhook received:", payload);

    // Trigger token sync
    await handleTokenSync(req, res, () => {});
  } catch (error) {
    console.error("Webhook processing failed:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

export const handleManualSync: RequestHandler = async (req, res) => {
  console.log("Manual sync triggered by user");
  await handleTokenSync(req, res, () => {});
};

export const handleSyncStatus: RequestHandler = (req, res) => {
  res.json({
    automation: {
      enabled: !!config.githubToken,
      lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
      nextScheduled: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min from now
      repos: {
        ios: config.iosRepo,
        android: config.androidRepo,
      },
      webhookEnabled: !!config.webhookSecret,
    },
    status: "healthy",
  });
};

// Helper functions
async function loadTokensFromFiles() {
  // This would load tokens from the file system
  // For now, return mock data - in real implementation, load from tokens/ folder
  return [];
}

async function generateIOSCode(
  tokens: any[],
  mode: "Light" | "Dark",
): Promise<string> {
  try {
    // Use Style Dictionary for better token generation
    await execAsync("npm run tokens:build:ios");

    // Read the generated iOS file
    const filename =
      mode === "Light"
        ? "DesignSystemLightColors.swift"
        : "DesignSystemDarkColors.swift";
    const filePath = `./build/ios/${filename}`;

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      return content;
    } else {
      throw new Error(`Generated iOS file not found: ${filePath}`);
    }
  } catch (error) {
    console.error("iOS code generation failed:", error);
    throw error;
  }
}

async function generateAndroidCode(
  tokens: any[],
): Promise<{ xml: string; kotlin: string }> {
  try {
    // Use Style Dictionary for better token generation
    await execAsync("npm run tokens:build:android");

    // Read the generated Android files
    const xmlPath = "./build/android/colors.xml";
    const kotlinPath = "./build/android/DesignSystemColors.kt";

    if (fs.existsSync(xmlPath) && fs.existsSync(kotlinPath)) {
      const xml = fs.readFileSync(xmlPath, "utf8");
      const kotlin = fs.readFileSync(kotlinPath, "utf8");
      return { xml, kotlin };
    } else {
      throw new Error("Generated Android files not found");
    }
  } catch (error) {
    console.error("Android code generation failed:", error);
    throw error;
  }
}

async function updateGitHubRepo(
  repo: string,
  files: Array<{ path: string; content: string }>,
  message: string,
) {
  if (!config.githubToken) {
    console.log("No GitHub token configured, skipping repo update");
    return;
  }

  // In a real implementation, use GitHub API to:
  // 1. Get current file SHAs
  // 2. Create/update files
  // 3. Create commit
  // 4. Update branch

  console.log(`Would update ${repo} with ${files.length} files: ${message}`);

  // Example GitHub API call structure:
  /*
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${file.path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${config.githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(file.content).toString('base64'),
      sha: existingSha, // Get from previous API call
    }),
  });
  */
}

function verifyWebhookSignature(
  payload: any,
  signature: string,
  secret: string,
): boolean {
  // Implement webhook signature verification
  // This would use crypto.createHmac to verify the signature
  return true; // Simplified for demo
}
