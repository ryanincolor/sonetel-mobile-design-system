#!/usr/bin/env node

/**
 * Unified Platform Sync Script
 * Dead simple way to update both iOS and Android apps with latest design tokens
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Configuration
const CONFIG = {
  ios: {
    projectPath: process.env.IOS_PROJECT_PATH || "../sonetel-mobile-ios",
    designSystemPath: "Sonetel Mobile/DesignSystem",
    files: [
      "DesignSystemColors.swift",
      "DesignSystemTypography.swift",
      "DesignSystemSpacing.swift",
    ],
  },
  android: {
    projectPath:
      process.env.ANDROID_PROJECT_PATH || "../sonetel-mobile-android",
    resPath: "app/src/main/res",
    kotlinPath: "app/src/main/java/com/sonetel/designsystem",
    themeKotlinPath: "app/src/main/java/com/sonetel/ui/theme",
    files: {
      resources: [
        { src: "values/design_colors.xml", dest: "values/design_colors.xml" },
        { src: "values/design_dimens.xml", dest: "values/design_dimens.xml" },
        {
          src: "values-night/design_colors.xml",
          dest: "values-night/design_colors.xml",
        },
      ],
      kotlin: [
        { src: "SonetelDesignTokens.kt", dest: "SonetelDesignTokens.kt" },
        {
          src: "SonetelColorScheme.kt",
          dest: "SonetelColorScheme.kt",
          path: "themeKotlinPath",
        },
      ],
    },
  },
  gitCommitMessage: "feat: update design system tokens",
  branchName: `design-tokens-${new Date().toISOString().split("T")[0]}`,
};

async function main() {
  const args = process.argv.slice(2);
  const useGit = args.includes("--git");
  const pushChanges = args.includes("--push");

  console.log("🚀 Starting unified design token sync...");
  console.log(`📱 Target platforms: iOS + Android`);

  if (useGit) {
    console.log(`🔄 Git operations: enabled`);
    if (pushChanges) {
      console.log(`⬆️  Push to remote: enabled`);
    }
  }

  try {
    // Step 1: Generate fresh tokens for both platforms
    console.log("\n📦 Generating fresh design tokens...");
    execSync("node scripts/build-all-tokens.js", { stdio: "inherit" });

    // Step 2: Sync to iOS
    console.log("\n📱 Syncing to iOS project...");
    await syncToIOS(useGit);

    // Step 3: Sync to Android
    console.log("\n🤖 Syncing to Android project...");
    await syncToAndroid(useGit);

    // Step 4: Push changes if requested
    if (useGit && pushChanges) {
      console.log("\n⬆️  Pushing changes to remote repositories...");
      await pushToRemote();
    }

    // Step 5: Generate report
    generateReport();

    console.log("\n🎉 All platforms synced successfully!");
  } catch (error) {
    console.error("❌ Sync failed:", error.message);
    process.exit(1);
  }
}

async function syncToIOS(useGit) {
  const iosProjectPath = path.resolve(CONFIG.ios.projectPath);

  // Check if iOS project exists
  if (!fs.existsSync(iosProjectPath)) {
    console.log(`⚠️  iOS project not found at: ${iosProjectPath}`);
    console.log(`ℹ️  Skipping iOS sync...`);
    return;
  }

  const designSystemPath = path.join(
    iosProjectPath,
    CONFIG.ios.designSystemPath,
  );

  // Create directory if it doesn't exist
  if (!fs.existsSync(designSystemPath)) {
    fs.mkdirSync(designSystemPath, { recursive: true });
    console.log(`📁 Created iOS DesignSystem directory`);
  }

  // Copy Swift files
  let copiedFiles = [];
  for (const file of CONFIG.ios.files) {
    const sourcePath = path.join("./dist/ios", file);
    const destPath = path.join(designSystemPath, file);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      copiedFiles.push(file);
      console.log(`   ✅ ${file}`);
    }
  }

  // Git operations for iOS
  if (useGit) {
    await handleGitOperations(iosProjectPath, copiedFiles, "iOS");
  }

  console.log(`✅ iOS sync complete (${copiedFiles.length} files)`);
}

async function syncToAndroid(useGit) {
  const androidProjectPath = path.resolve(CONFIG.android.projectPath);

  // Check if Android project exists
  if (!fs.existsSync(androidProjectPath)) {
    console.log(`⚠️  Android project not found at: ${androidProjectPath}`);
    console.log(`ℹ️  Skipping Android sync...`);
    return;
  }

  const resPath = path.join(androidProjectPath, CONFIG.android.resPath);
  const kotlinPath = path.join(androidProjectPath, CONFIG.android.kotlinPath);
  const themeKotlinPath = path.join(
    androidProjectPath,
    CONFIG.android.themeKotlinPath,
  );

  // Create directories if they don't exist
  [resPath, kotlinPath, themeKotlinPath].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  let copiedFiles = [];

  // Copy resource files
  for (const file of CONFIG.android.files.resources) {
    const sourcePath = path.join("./dist/android", file.src);
    const destPath = path.join(resPath, file.dest);

    // Ensure destination directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      copiedFiles.push(file.dest);
      console.log(`   ✅ ${file.dest}`);
    }
  }

  // Copy Kotlin files
  for (const file of CONFIG.android.files.kotlin) {
    const sourcePath = path.join("./dist/android", file.src);
    const targetPath =
      file.path === "themeKotlinPath" ? themeKotlinPath : kotlinPath;
    const destPath = path.join(targetPath, file.dest);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      copiedFiles.push(file.dest);
      console.log(`   ✅ ${file.dest}`);
    }
  }

  // Git operations for Android
  if (useGit) {
    await handleGitOperations(androidProjectPath, copiedFiles, "Android");
  }

  console.log(`✅ Android sync complete (${copiedFiles.length} files)`);
}

async function handleGitOperations(projectPath, copiedFiles, platform) {
  const originalDir = process.cwd();

  try {
    process.chdir(projectPath);

    // Check if it's a git repository
    try {
      execSync("git status", { stdio: "pipe" });
    } catch {
      console.log(
        `ℹ️  ${platform} project is not a git repository, skipping git operations`,
      );
      return;
    }

    // Create new branch
    try {
      execSync(`git checkout -b ${CONFIG.branchName}`, { stdio: "pipe" });
      console.log(`📌 Created branch: ${CONFIG.branchName}`);
    } catch {
      // Branch might already exist
      try {
        execSync(`git checkout ${CONFIG.branchName}`, { stdio: "pipe" });
        console.log(`📌 Switched to existing branch: ${CONFIG.branchName}`);
      } catch (e) {
        console.log(`⚠️  Could not create/switch to branch: ${e.message}`);
        return;
      }
    }

    // Stage all design system changes
    if (platform === "iOS") {
      execSync(`git add "${CONFIG.ios.designSystemPath}/*"`, { stdio: "pipe" });
    } else {
      execSync(`git add "${CONFIG.android.resPath}/values*/*"`, {
        stdio: "pipe",
      });
      execSync(`git add "${CONFIG.android.kotlinPath}/*"`, { stdio: "pipe" });
      execSync(`git add "${CONFIG.android.themeKotlinPath}/*"`, {
        stdio: "pipe",
      });
    }

    // Commit changes
    try {
      const commitMessage = `${CONFIG.gitCommitMessage} (${platform})`;
      execSync(`git commit -m "${commitMessage}"`, { stdio: "pipe" });
      console.log(`✅ Changes committed for ${platform}`);
    } catch {
      console.log(`ℹ️  No changes to commit for ${platform}`);
    }
  } finally {
    process.chdir(originalDir);
  }
}

async function pushToRemote() {
  const platforms = [
    { name: "iOS", path: CONFIG.ios.projectPath },
    { name: "Android", path: CONFIG.android.projectPath },
  ];

  for (const platform of platforms) {
    const projectPath = path.resolve(platform.path);

    if (!fs.existsSync(projectPath)) continue;

    const originalDir = process.cwd();

    try {
      process.chdir(projectPath);

      try {
        execSync(`git push origin ${CONFIG.branchName}`, { stdio: "pipe" });
        console.log(`✅ ${platform.name} changes pushed to remote`);
      } catch (error) {
        console.log(
          `⚠️  Failed to push ${platform.name} changes: ${error.message}`,
        );
      }
    } finally {
      process.chdir(originalDir);
    }
  }
}

function generateReport() {
  const stats = JSON.parse(fs.readFileSync("./dist/stats.json", "utf8"));

  console.log(`
📊 Design System Sync Report
═══════════════════════════════════

🎨 Tokens Synced:
   • Colors: ${stats.colors} (light + dark variants)
   • Typography: ${stats.typography} sizes
   • Spacing: ${stats.spacing} values  
   • Border Radius: ${stats.borderRadius} values
   • Total: ${stats.totalTokens} tokens

📱 iOS Integration:
   • Location: ${CONFIG.ios.projectPath}/${CONFIG.ios.designSystemPath}
   • Files: ${stats.platforms.ios.files.join(", ")}
   • Usage: UIColor.solidZ0, DesignSystemTypography.headlineH1

🤖 Android Integration:
   • Resources: ${CONFIG.android.projectPath}/${CONFIG.android.resPath}
   • Compose: ${CONFIG.android.projectPath}/${CONFIG.android.kotlinPath}
   • Usage: @color/solid_z0, SonetelDesignTokens.solidZ0Light

💡 Next Steps:
   1. Build your mobile apps to verify compilation
   2. Test light/dark mode switching
   3. Update components to use new design tokens

🔄 To sync again: npm run sync:all${process.argv.includes("--git") ? ":git" : ""}
`);
}

// Help text
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
🚀 Unified Design Token Sync

Usage:
  node scripts/sync-all-platforms.js [options]

Options:
  --git          Create git branches and commit changes
  --push         Push changes to remote (requires --git)  
  --help, -h     Show this help message

Environment Variables:
  IOS_PROJECT_PATH       Path to iOS project (default: ../sonetel-mobile-ios)
  ANDROID_PROJECT_PATH   Path to Android project (default: ../sonetel-mobile-android)

Examples:
  # Basic sync to both platforms
  npm run sync:all
  
  # Sync with git operations
  npm run sync:all:git
  
  # Sync, commit, and push
  npm run sync:all:git:push

This script:
  1. Generates fresh tokens for both platforms
  2. Copies files to both iOS and Android projects
  3. Optionally creates git branches and commits
  4. Provides a detailed sync report
`);
  process.exit(0);
}

// Run the sync
main().catch(console.error);
