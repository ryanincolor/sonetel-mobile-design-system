#!/usr/bin/env node

/**
 * Android Sync Script
 * Automatically syncs generated design tokens to an Android project
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Configuration - Update these paths for your setup
const CONFIG = {
  // Path to your Android project (update this!)
  androidProjectPath:
    process.env.ANDROID_PROJECT_PATH || "../sonetel-mobile-android",

  // Path within Android project where design system files go
  designSystemResPath: "app/src/main/res",
  designSystemKotlinPath: "app/src/main/java/com/sonetel/designsystem",

  // Git settings
  gitCommitMessage: "chore: update design system tokens",

  // Notification settings
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,

  // Branch to create for changes
  branchName: `design-system-update-${new Date().toISOString().split("T")[0]}`,
};

async function main() {
  console.log("🚀 Starting Android design system sync...");

  try {
    // Step 1: Generate fresh tokens
    console.log("📦 Generating Android tokens...");
    execSync("npm run tokens:build:android", { stdio: "inherit" });

    // Step 2: Check if Android project exists
    const androidProjectFullPath = path.resolve(CONFIG.androidProjectPath);
    if (!fs.existsSync(androidProjectFullPath)) {
      console.error(
        `❌ Android project not found at: ${androidProjectFullPath}`,
      );
      console.log(
        "💡 Update ANDROID_PROJECT_PATH environment variable or CONFIG.androidProjectPath in script",
      );
      process.exit(1);
    }

    // Step 3: Prepare destination directories
    const resFullPath = path.join(
      androidProjectFullPath,
      CONFIG.designSystemResPath,
    );
    const kotlinFullPath = path.join(
      androidProjectFullPath,
      CONFIG.designSystemKotlinPath,
    );

    // Create directories if they don't exist
    if (!fs.existsSync(resFullPath)) {
      console.log(`📁 Creating res directory: ${resFullPath}`);
      fs.mkdirSync(resFullPath, { recursive: true });
    }

    if (!fs.existsSync(kotlinFullPath)) {
      console.log(`📁 Creating Kotlin directory: ${kotlinFullPath}`);
      fs.mkdirSync(kotlinFullPath, { recursive: true });
    }

    // Step 4: Generate stats file
    generateStatsFile();

    // Step 5: Copy resource files
    console.log("📋 Copying Android resource files...");
    const sourceDir = "./dist/android";

    let copiedFiles = [];

    // Copy values directories (XML resources)
    const valuesDir = path.join(sourceDir, "values");
    const valuesNightDir = path.join(sourceDir, "values-night");

    if (fs.existsSync(valuesDir)) {
      const destValuesDir = path.join(resFullPath, "values");
      if (!fs.existsSync(destValuesDir)) {
        fs.mkdirSync(destValuesDir, { recursive: true });
      }

      const valuesFiles = fs.readdirSync(valuesDir);
      for (const file of valuesFiles) {
        const sourcePath = path.join(valuesDir, file);
        const destPath = path.join(destValuesDir, file);
        fs.copyFileSync(sourcePath, destPath);
        copiedFiles.push(`values/${file}`);
        console.log(`   ✅ values/${file}`);
      }
    }

    if (fs.existsSync(valuesNightDir)) {
      const destValuesNightDir = path.join(resFullPath, "values-night");
      if (!fs.existsSync(destValuesNightDir)) {
        fs.mkdirSync(destValuesNightDir, { recursive: true });
      }

      const valuesNightFiles = fs.readdirSync(valuesNightDir);
      for (const file of valuesNightFiles) {
        const sourcePath = path.join(valuesNightDir, file);
        const destPath = path.join(destValuesNightDir, file);
        fs.copyFileSync(sourcePath, destPath);
        copiedFiles.push(`values-night/${file}`);
        console.log(`   ✅ values-night/${file}`);
      }
    }

    // Copy Kotlin file
    const kotlinFile = "DesignSystemTokens.kt";
    const kotlinSourcePath = path.join(sourceDir, kotlinFile);
    if (fs.existsSync(kotlinSourcePath)) {
      const kotlinDestPath = path.join(kotlinFullPath, kotlinFile);
      fs.copyFileSync(kotlinSourcePath, kotlinDestPath);
      copiedFiles.push(kotlinFile);
      console.log(`   ✅ ${kotlinFile}`);
    }

    // Step 6: Generate integration report
    const report = generateIntegrationReport(copiedFiles);

    // Step 7: Git operations (if requested)
    if (process.argv.includes("--git")) {
      await handleGitOperations(androidProjectFullPath, copiedFiles);
    }

    // Step 8: Send notifications (if configured)
    if (CONFIG.slackWebhookUrl) {
      await sendSlackNotification(copiedFiles);
    }

    console.log("🎉 Android sync completed successfully!");
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
    stats = JSON.parse(fs.readFileSync("./dist/android/stats.json", "utf8"));
  } catch (error) {
    // Stats file doesn't exist, use empty object
    stats = {};
  }

  return `
📊 Android Design System Sync Report
═══════════════════════════════════

📁 Destination: ${CONFIG.androidProjectPath}/${CONFIG.designSystemResPath}
📁 Kotlin: ${CONFIG.androidProjectPath}/${CONFIG.designSystemKotlinPath}

📦 Files Updated:
${copiedFiles.map((file) => `   • ${file}`).join("\n")}

🎨 Token Summary:
   • Light Colors: ${stats.lightColors || "N/A"} tokens
   • Dark Colors: ${stats.darkColors || "N/A"} tokens  
   • Dimensions: ${stats.dimensions || "N/A"} tokens
   • Total: ${stats.totalTokens || "N/A"} tokens

💡 Next Steps:
   1. Build your Android project to verify compilation
   2. Test light/dark mode switching
   3. Replace hardcoded values with design tokens

📖 Integration Guide: ./ANDROID_INTEGRATION.md
`;
}

async function handleGitOperations(androidProjectPath, copiedFiles) {
  console.log("🔄 Handling git operations...");

  const originalDir = process.cwd();

  try {
    process.chdir(androidProjectPath);

    // Check if it's a git repository
    try {
      execSync("git status", { stdio: "pipe" });
    } catch {
      console.log(
        "ℹ️  Android project is not a git repository, skipping git operations",
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
    execSync(`git add "${CONFIG.designSystemResPath}/*"`, { stdio: "pipe" });
    execSync(`git add "${CONFIG.designSystemKotlinPath}/*"`, { stdio: "pipe" });

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
    text: "🤖 Android Design System Updated",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Android Design System tokens have been updated*\n\n*Files synced:*\n${copiedFiles.map((f) => `• \`${f}\``).join("\n")}\n\n*Android Project:* \`${CONFIG.androidProjectPath}\``,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Next Steps:*\n• Build and test your Android app\n• Verify light/dark mode switching\n• Check the integration guide for details",
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
    const kotlinFile = fs.readFileSync(
      "./dist/android/DesignSystemTokens.kt",
      "utf8",
    );
    const valuesFile = fs.readFileSync(
      "./dist/android/values/design_colors.xml",
      "utf8",
    );

    const stats = {
      colors: (valuesFile.match(/<color name=/g) || []).length,
      dimensions: (valuesFile.match(/<dimen name=/g) || []).length,
      kotlinTokens: (kotlinFile.match(/val \w+/g) || []).length,
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync(
      "./dist/android/stats.json",
      JSON.stringify(stats, null, 2),
    );
  } catch (error) {
    console.log("⚠️  Could not generate stats file:", error.message);
  }
}

// Help text
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
🤖 Android Design System Sync

Usage:
  node scripts/sync-android.js [options]

Options:
  --git          Create git branch and commit changes
  --push         Push changes to remote (requires --git)
  --help, -h     Show this help message

Environment Variables:
  ANDROID_PROJECT_PATH     Path to your Android project (default: ../sonetel-mobile-android)
  SLACK_WEBHOOK_URL        Slack webhook for notifications (optional)

Examples:
  # Basic sync
  node scripts/sync-android.js
  
  # Sync with git operations
  node scripts/sync-android.js --git
  
  # Sync, commit, and push
  node scripts/sync-android.js --git --push
  
  # With custom Android project path
  ANDROID_PROJECT_PATH="../MyAndroidApp" node scripts/sync-android.js --git

Configuration:
  Edit CONFIG object in this script to set default paths
`);
  process.exit(0);
}

// Run the sync
main().catch(console.error);
