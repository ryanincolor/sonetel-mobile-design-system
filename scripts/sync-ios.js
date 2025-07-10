#!/usr/bin/env node

/**
 * iOS Sync Script
 * Automatically syncs generated design tokens to an iOS project
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Configuration - Update these paths for your setup
const CONFIG = {
  // Path to your iOS project (update this!)
  iosProjectPath: process.env.IOS_PROJECT_PATH || "../sonetel-mobile-ios",

  // Path within iOS project where design system files go
  designSystemPath: "Sonetel Mobile/DesignSystem",

  // Git settings
  gitCommitMessage: "chore: update design system tokens",

  // Notification settings
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,

  // Branch to create for changes
  branchName: `design-system-update-${new Date().toISOString().split("T")[0]}`,
};

async function main() {
  console.log("🚀 Starting iOS design system sync...");

  try {
    // Step 1: Generate fresh tokens
    console.log("📦 Generating tokens...");
    execSync("npm run tokens:build", { stdio: "inherit" });

    // Step 2: Check if iOS project exists
    const iosProjectFullPath = path.resolve(CONFIG.iosProjectPath);
    if (!fs.existsSync(iosProjectFullPath)) {
      console.error(`❌ iOS project not found at: ${iosProjectFullPath}`);
      console.log(
        "💡 Update IOS_PROJECT_PATH environment variable or CONFIG.iosProjectPath in script",
      );
      process.exit(1);
    }

    // Step 3: Prepare destination directory
    const designSystemFullPath = path.join(
      iosProjectFullPath,
      CONFIG.designSystemPath,
    );
    if (!fs.existsSync(designSystemFullPath)) {
      console.log(
        `📁 Creating DesignSystem directory: ${designSystemFullPath}`,
      );
      fs.mkdirSync(designSystemFullPath, { recursive: true });
    }

    // Step 4: Generate stats file
    generateStatsFile();

    // Step 5: Copy Swift files
    console.log("📋 Copying Swift files to iOS project...");
    const sourceDir = "./build/ios";
    const swiftFiles = fs
      .readdirSync(sourceDir)
      .filter((file) => file.endsWith(".swift"));

    let copiedFiles = [];
    for (const file of swiftFiles) {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(designSystemFullPath, file);

      fs.copyFileSync(sourcePath, destPath);
      copiedFiles.push(file);
      console.log(`   ✅ ${file}`);
    }

    // Step 6: Generate integration report
    const report = generateIntegrationReport(copiedFiles);

    // Step 7: Git operations (if requested)
    if (process.argv.includes("--git")) {
      await handleGitOperations(iosProjectFullPath, copiedFiles);
    }

    // Step 8: Send notifications (if configured)
    if (CONFIG.slackWebhookUrl) {
      await sendSlackNotification(copiedFiles);
    }

    console.log("🎉 iOS sync completed successfully!");
    console.log("\n📋 Integration Report:");
    console.log(report);
  } catch (error) {
    console.error("❌ Sync failed:", error.message);
    process.exit(1);
  }
}

function generateIntegrationReport(copiedFiles) {
  let stats = {};
  try {
    stats = JSON.parse(fs.readFileSync("./build/ios/stats.json", "utf8"));
  } catch (error) {
    // Stats file doesn't exist, use empty object
    stats = {};
  }

  return `
📊 Design System Sync Report
═══════════════════════════════

📁 Destination: ${CONFIG.iosProjectPath}/${CONFIG.designSystemPath}

📦 Files Updated:
${copiedFiles.map((file) => `   • ${file}`).join("\n")}

🎨 Token Summary:
   • Colors: Auto-adaptive light/dark mode
   • Typography: ${stats.typography || "N/A"} tokens
   • Spacing: ${stats.spacing || "N/A"} tokens
   • Border Radius: ${stats.borderRadius || "N/A"} tokens

💡 Next Steps:
   1. Build your iOS project to verify compilation
   2. Test light/dark mode switching
   3. Replace any hardcoded values with design tokens

📖 Integration Guide: ./IOS_INTEGRATION.md
`;
}

async function handleGitOperations(iosProjectPath, copiedFiles) {
  console.log("🔄 Handling git operations...");

  const originalDir = process.cwd();

  try {
    process.chdir(iosProjectPath);

    // Check if it's a git repository
    try {
      execSync("git status", { stdio: "pipe" });
    } catch {
      console.log(
        "ℹ️  iOS project is not a git repository, skipping git operations",
      );
      return;
    }

    // Create new branch
    try {
      execSync(`git checkout -b ${CONFIG.branchName}`, { stdio: "pipe" });
      console.log(`📌 Created branch: ${CONFIG.branchName}`);
    } catch {
      // Branch might already exist
      execSync(`git checkout ${CONFIG.branchName}`, { stdio: "pipe" });
      console.log(`📌 Switched to existing branch: ${CONFIG.branchName}`);
    }

    // Stage changes
    for (const file of copiedFiles) {
      const filePath = path.join(CONFIG.designSystemPath, file);
      execSync(`git add "${filePath}"`, { stdio: "pipe" });
    }

    // Commit changes
    try {
      execSync(`git commit -m "${CONFIG.gitCommitMessage}"`, { stdio: "pipe" });
      console.log("✅ Changes committed to git");

      // Push if --push flag is provided
      if (process.argv.includes("--push")) {
        execSync(`git push origin ${CONFIG.branchName}`, { stdio: "inherit" });
        console.log("✅ Changes pushed to remote");
      }
    } catch {
      console.log("ℹ️  No changes to commit");
    }
  } finally {
    process.chdir(originalDir);
  }
}

async function sendSlackNotification(copiedFiles) {
  if (!CONFIG.slackWebhookUrl) return;

  const message = {
    text: "🎨 Design System Updated",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Design System tokens have been updated*\n\n*Files synced:*\n${copiedFiles.map((f) => `��� \`${f}\``).join("\n")}\n\n*iOS Project:* \`${CONFIG.iosProjectPath}\``,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Next Steps:*\n• Build and test your iOS app\n• Verify light/dark mode switching\n• Check the integration guide for details",
        },
      },
    ],
  };

  try {
    const response = await fetch(CONFIG.slackWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (response.ok) {
      console.log("📱 Slack notification sent");
    }
  } catch (error) {
    console.log("⚠️  Failed to send Slack notification:", error.message);
  }
}

// Generate stats file for reporting
function generateStatsFile() {
  try {
    const colorSwift = fs.readFileSync(
      "./build/ios/DesignSystemColors.swift",
      "utf8",
    );
    const typographySwift = fs.readFileSync(
      "./build/ios/DesignSystemTypography.swift",
      "utf8",
    );
    const spacingSwift = fs.readFileSync(
      "./build/ios/DesignSystemSpacing.swift",
      "utf8",
    );

    const stats = {
      colors: (colorSwift.match(/static let \w+/g) || []).length,
      typography: (typographySwift.match(/static let \w+/g) || []).length,
      spacing: (spacingSwift.match(/static let \w+/g) || []).length,
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync("./build/ios/stats.json", JSON.stringify(stats, null, 2));
  } catch (error) {
    console.log("⚠️  Could not generate stats file:", error.message);
  }
}

// Help text
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
🚀 iOS Design System Sync

Usage:
  node scripts/sync-ios.js [options]

Options:
  --git          Create git branch and commit changes
  --push         Push changes to remote (requires --git)
  --help, -h     Show this help message

Environment Variables:
  IOS_PROJECT_PATH     Path to your iOS project (default: ../your-ios-app)
  SLACK_WEBHOOK_URL    Slack webhook for notifications (optional)

Examples:
  # Basic sync
  node scripts/sync-ios.js
  
  # Sync with git operations
  node scripts/sync-ios.js --git
  
  # Sync, commit, and push
  node scripts/sync-ios.js --git --push
  
  # With custom iOS project path
  IOS_PROJECT_PATH="../MyApp" node scripts/sync-ios.js --git

Configuration:
  Edit CONFIG object in this script to set default paths
`);
  process.exit(0);
}

// Run the sync
main().catch(console.error);
