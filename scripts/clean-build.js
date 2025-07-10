#!/usr/bin/env node

/**
 * Build Cleanup Script
 * Removes all generated build files and legacy directories
 */

import fs from "fs";
import path from "path";

console.log("🧹 Starting comprehensive build cleanup...");

// All possible build and legacy locations
const pathsToClean = [
  "./build",
  "./dist",
  "./design-system",
  "./mobile-components/dist",
  "./.vite", // Vite build cache
  "./node_modules/.cache", // npm/yarn cache
];

let totalCleaned = 0;
let totalSize = 0;

pathsToClean.forEach((targetPath) => {
  if (fs.existsSync(targetPath)) {
    try {
      // Calculate size before deletion
      const sizeInfo = calculateDirectorySize(targetPath);

      console.log(`🗑️  Removing ${targetPath}...`);
      console.log(
        `   Files: ${sizeInfo.files}, Size: ${formatBytes(sizeInfo.size)}`,
      );

      fs.rmSync(targetPath, { recursive: true, force: true });

      totalCleaned += sizeInfo.files;
      totalSize += sizeInfo.size;

      console.log(`✅ Cleaned: ${targetPath}`);
    } catch (error) {
      console.log(`❌ Failed to clean ${targetPath}: ${error.message}`);
    }
  } else {
    console.log(`⏭️  Skipping ${targetPath} (doesn't exist)`);
  }
});

console.log(`\n🎉 Cleanup complete!`);
console.log(`   Total files removed: ${totalCleaned}`);
console.log(`   Total space freed: ${formatBytes(totalSize)}`);

if (totalCleaned === 0) {
  console.log("✨ All directories were already clean!");
}

function calculateDirectorySize(dirPath) {
  let size = 0;
  let files = 0;

  function calculateSize(itemPath) {
    try {
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        const items = fs.readdirSync(itemPath);
        items.forEach((item) => {
          calculateSize(path.join(itemPath, item));
        });
      } else {
        size += stat.size;
        files++;
      }
    } catch (error) {
      // Skip files we can't read
    }
  }

  calculateSize(dirPath);
  return { size, files };
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
