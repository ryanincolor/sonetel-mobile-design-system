#!/usr/bin/env node

/**
 * Token Export Script
 * Generates platform-specific design tokens for iOS and Android
 */

const fs = require("fs");
const path = require("path");

// Ensure dist directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

async function loadTokens() {
  const tokens = [];
  const referenceMap = new Map();

  try {
    // Load Core tokens for reference resolution
    const coreColorsPath = "./tokens/Core/Colors/Mode 1.json";
    if (fs.existsSync(coreColorsPath)) {
      const coreColors = JSON.parse(fs.readFileSync(coreColorsPath, "utf8"));
      buildReferenceMap(coreColors, referenceMap, "");
    }

    // Load Sys tokens
    const sysColorLightPath = "./tokens/Sys/Color/Light.json";
    if (fs.existsSync(sysColorLightPath)) {
      const sysColorLight = JSON.parse(
        fs.readFileSync(sysColorLightPath, "utf8"),
      );
      parseTokens(sysColorLight, tokens, "Color", "Light", referenceMap);
    }

    const sysColorDarkPath = "./tokens/Sys/Color/Dark.json";
    if (fs.existsSync(sysColorDarkPath)) {
      const sysColorDark = JSON.parse(
        fs.readFileSync(sysColorDarkPath, "utf8"),
      );
      parseTokens(sysColorDark, tokens, "Color", "Dark", referenceMap);
    }

    const sysTypographyPath = "./tokens/Sys/Typography.json";
    if (fs.existsSync(sysTypographyPath)) {
      const sysTypography = JSON.parse(
        fs.readFileSync(sysTypographyPath, "utf8"),
      );
      parseTokens(sysTypography, tokens, "Typography", null, referenceMap);
    }

    const sysSpacingPath = "./tokens/Sys/Spacing.json";
    if (fs.existsSync(sysSpacingPath)) {
      const sysSpacing = JSON.parse(fs.readFileSync(sysSpacingPath, "utf8"));
      parseTokens(sysSpacing, tokens, "Spacing", null, referenceMap);
    }

    return tokens;
  } catch (error) {
    console.error("Failed to load tokens:", error);
    return [];
  }
}

function buildReferenceMap(obj, referenceMap, prefix) {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") {
      if ("value" in value && "type" in value) {
        referenceMap.set(fullKey, String(value.value));
      } else {
        buildReferenceMap(value, referenceMap, fullKey);
      }
    }
  }
}

function resolveTokenValue(value, referenceMap) {
  if (
    typeof value === "string" &&
    value.startsWith("{") &&
    value.endsWith("}")
  ) {
    const reference = value.slice(1, -1);
    const resolvedValue = referenceMap.get(reference);
    if (resolvedValue) {
      if (resolvedValue.startsWith("{") && resolvedValue.endsWith("}")) {
        return resolveTokenValue(resolvedValue, referenceMap);
      }
      return resolvedValue;
    }
  }
  return value;
}

function parseTokens(obj, tokens, type, mode, referenceMap, prefix = "") {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") {
      if ("value" in value && "type" in value) {
        const rawValue = String(value.value);
        const resolvedValue = resolveTokenValue(rawValue, referenceMap);
        tokens.push({
          name: fullKey,
          value: resolvedValue,
          type: type,
          mode: mode,
          rawValue: rawValue,
        });
      } else {
        parseTokens(value, tokens, type, mode, referenceMap, fullKey);
      }
    }
  }
}

function generateSwiftVariableName(name) {
  return name
    .split(".")
    .map((part, index) => {
      if (index === 0) return part.toLowerCase();
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("")
    .replace(/[^a-zA-Z0-9]/g, "");
}

function convertHexToUIColor(hex) {
  if (!hex.startsWith("#") || hex.length !== 7)
    return `UIColor(named: "${hex}")`;

  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  return `UIColor(red: ${r.toFixed(3)}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)}, alpha: 1.0)`;
}

function generateIOSColors(tokens, mode) {
  const colorTokens = tokens.filter(
    (t) => t.type === "Color" && t.mode === mode,
  );

  let code = `// ${mode} Mode Design Tokens - Generated from Design System
// Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually

import UIKit

extension UIColor {
    
    // MARK: - ${mode} Mode Colors
    
`;

  colorTokens.forEach((token) => {
    const varName = generateSwiftVariableName(token.name);
    const colorValue = convertHexToUIColor(token.value);
    const comment =
      token.rawValue && token.rawValue !== token.value
        ? `\n    /// Reference: ${token.rawValue}`
        : "";

    code += `${comment}
    static let ${varName} = ${colorValue}
    
`;
  });

  code += `}

// MARK: - Usage Example
/*
// Set background color
view.backgroundColor = .solidZ0

// Set text color  
label.textColor = .onSurfacePrimary
*/`;

  return code;
}

function generateAndroidColorsXML(tokens) {
  const colorTokens = tokens.filter((t) => t.type === "Color");

  let xml = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generated Design Tokens - Colors -->
<!-- Auto-generated from Design System - Do not edit manually -->

<resources>
    
`;

  colorTokens.forEach((token) => {
    const resourceName = token.name.replace(/\./g, "_").toLowerCase();
    const colorValue = token.value.toUpperCase();
    const comment =
      token.rawValue && token.rawValue !== token.value
        ? `\n    <!-- Reference: ${token.rawValue} -->`
        : "";

    xml += `${comment}
    <color name="${resourceName}">${colorValue}</color>
    
`;
  });

  xml += `</resources>
`;

  return xml;
}

function generateAndroidColorsKotlin(tokens) {
  const colorTokens = tokens.filter((t) => t.type === "Color");

  let kotlin = `// Generated Design Tokens - Colors
// Auto-generated from Design System - Do not edit manually

package com.yourapp.designsystem

import androidx.compose.ui.graphics.Color

object DesignSystemColors {
    
`;

  colorTokens.forEach((token) => {
    const varName = generateSwiftVariableName(token.name);
    const comment =
      token.rawValue && token.rawValue !== token.value
        ? `\n    /** Reference: ${token.rawValue} */`
        : "";

    let colorValue = token.value;
    if (colorValue.startsWith("#")) {
      const hex = colorValue.slice(1);
      if (hex.length === 6) {
        colorValue = `Color(0xFF${hex.toUpperCase()})`;
      }
    }

    kotlin += `${comment}
    val ${varName} = ${colorValue}
    
`;
  });

  kotlin += `}
`;

  return kotlin;
}

async function exportTokens() {
  console.log("🎨 Exporting design tokens...");

  const tokens = await loadTokens();
  console.log(`📦 Loaded ${tokens.length} tokens`);

  // Ensure output directories exist
  ensureDir("./build/ios");
  ensureDir("./build/android");

  // Generate iOS files
  const iosLightCode = generateIOSColors(tokens, "Light");
  const iosDarkCode = generateIOSColors(tokens, "Dark");

  fs.writeFileSync("./build/ios/DesignSystemLightColors.swift", iosLightCode);
  fs.writeFileSync("./build/ios/DesignSystemDarkColors.swift", iosDarkCode);

  console.log("✅ Generated iOS Swift files");

  // Generate Android files
  const androidXml = generateAndroidColorsXML(tokens);
  const androidKotlin = generateAndroidColorsKotlin(tokens);

  fs.writeFileSync("./build/android/colors.xml", androidXml);
  fs.writeFileSync("./build/android/DesignSystemColors.kt", androidKotlin);

  console.log("✅ Generated Android files");

  console.log("🚀 Token export complete!");
}

// Run if called directly
if (require.main === module) {
  exportTokens().catch(console.error);
}

module.exports = { exportTokens };
