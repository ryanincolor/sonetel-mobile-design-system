#!/usr/bin/env node

/**
 * Android Design Token Generator (Using iOS Logic)
 * Generates Android XML resources and Kotlin objects using same extraction as iOS
 */

import fs from "fs";
import path from "path";

// Token loading utility (same as iOS)
function loadTokens() {
  console.log("📖 Loading Core tokens...");

  const coreTypography = JSON.parse(
    fs.readFileSync("./tokens/Core/Typography.json", "utf8"),
  );
  const coreSpacing = JSON.parse(
    fs.readFileSync("./tokens/Core/Spacings.json", "utf8"),
  );

  // Load Core colors for reference resolution
  let coreColors = {};
  try {
    coreColors = JSON.parse(
      fs.readFileSync("./tokens/Core/Colors.json", "utf8"),
    );
    console.log("📖 Loaded Core Colors");
  } catch (e) {
    console.log("ℹ️  Core colors not found");
  }

  console.log("📖 Loaded Core Typography");
  console.log("📖 Loaded Core Spacing");

  console.log("📖 Loading Sys tokens...");

  const sysColorsLight = JSON.parse(
    fs.readFileSync("./tokens/Sys/Color/Light.json", "utf8"),
  );
  let sysColorsDark = null;
  try {
    sysColorsDark = JSON.parse(
      fs.readFileSync("./tokens/Sys/Color/Dark.json", "utf8"),
    );
    console.log("🌙 Loaded Dark mode colors");
  } catch (e) {
    console.log("ℹ️  No dark mode colors found");
  }

  const sysTypography = JSON.parse(
    fs.readFileSync("./tokens/Sys/Typography.json", "utf8"),
  );
  const sysSpacing = JSON.parse(
    fs.readFileSync("./tokens/Sys/Spacing.json", "utf8"),
  );
  const sysBorderRadius = JSON.parse(
    fs.readFileSync("./tokens/Sys/Border Radius.json", "utf8"),
  );

  console.log("✅ All token files loaded successfully");

  // Build reference map (same as iOS)
  const refs = new Map();

  function mapRefs(obj, prefix = "") {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object" && "value" in value) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        refs.set(fullKey, value.value);
      } else if (value && typeof value === "object") {
        mapRefs(value, prefix ? `${prefix}.${key}` : key);
      }
    }
  }

  mapRefs(coreTypography, "font");
  mapRefs(coreSpacing, "spacing");
  mapRefs(coreColors);
  mapRefs(sysColorsLight);
  if (sysColorsDark) {
    mapRefs(sysColorsDark);
  }
  mapRefs(sysTypography);
  mapRefs(sysSpacing);
  mapRefs(sysBorderRadius);
  console.log(`📊 Built reference map with ${refs.size} entries`);

  // Resolve a reference (same as iOS)
  function resolve(value) {
    if (
      typeof value === "string" &&
      value.startsWith("{") &&
      value.endsWith("}")
    ) {
      const ref = value.slice(1, -1);
      const resolved = refs.get(ref);
      return resolved || value;
    }
    return value;
  }

  // Extract all token types (same as iOS)
  const colorTokensLight = [];
  const colorTokensDark = [];
  const typographyTokens = [];
  const spacingTokens = [];
  const borderRadiusTokens = [];

  function extractTokens(obj, tokenArray, tokenType, prefix = "", mode = null) {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (
        value &&
        typeof value === "object" &&
        "value" in value &&
        "type" in value
      ) {
        const resolvedValue = resolve(value.value);
        tokenArray.push({
          name: fullKey,
          value: resolvedValue,
          originalValue: value.value,
          type: tokenType,
          originalType: value.type,
          mode: mode,
        });
      } else if (value && typeof value === "object") {
        extractTokens(value, tokenArray, tokenType, fullKey, mode);
      }
    }
  }

  // Extract different token types (same as iOS)
  extractTokens(sysColorsLight, colorTokensLight, "color", "", "Light");
  if (sysColorsDark) {
    extractTokens(sysColorsDark, colorTokensDark, "color", "", "Dark");
  }
  extractTokens(sysTypography, typographyTokens, "typography");
  extractTokens(sysSpacing, spacingTokens, "spacing");
  extractTokens(sysBorderRadius, borderRadiusTokens, "borderRadius");

  const totalTokens =
    colorTokensLight.length +
    colorTokensDark.length +
    typographyTokens.length +
    spacingTokens.length +
    borderRadiusTokens.length;

  console.log(`🎨 Extracted ${colorTokensLight.length} light color tokens`);
  if (colorTokensDark.length > 0) {
    console.log(`🌙 Extracted ${colorTokensDark.length} dark color tokens`);
  }
  console.log(`📝 Extracted ${typographyTokens.length} typography tokens`);
  console.log(`📏 Extracted ${spacingTokens.length} spacing tokens`);
  console.log(`🔘 Extracted ${borderRadiusTokens.length} border radius tokens`);
  console.log(`📊 Total: ${totalTokens} tokens`);

  // Show sample tokens
  if (colorTokensLight.length > 0) {
    console.log("🎨 Sample light color tokens:");
    colorTokensLight.slice(0, 3).forEach((token) => {
      console.log(`  ${token.name}: ${token.originalValue} ��� ${token.value}`);
    });
  }

  if (colorTokensDark.length > 0) {
    console.log("🌙 Sample dark color tokens:");
    colorTokensDark.slice(0, 3).forEach((token) => {
      console.log(`  ${token.name}: ${token.originalValue} → ${token.value}`);
    });
  }

  if (spacingTokens.length > 0) {
    console.log("📏 Sample spacing tokens:");
    spacingTokens.slice(0, 3).forEach((token) => {
      console.log(`  ${token.name}: ${token.originalValue} → ${token.value}`);
    });
  }

  return {
    colorTokensLight,
    colorTokensDark,
    typographyTokens,
    spacingTokens,
    borderRadiusTokens,
    totalTokens,
  };
}

// Convert token name to Android resource name
function toAndroidName(name) {
  return name.toLowerCase().replace(/[.\s-]/g, "_");
}

// Generate Android XML for colors
function generateColorsXML(colorTokens, isDark = false) {
  const theme = isDark ? "Dark" : "Light";
  let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
  xml += `<!-- Design System ${theme} Colors - Auto-generated on ${new Date().toLocaleDateString()} -->\n`;
  xml += `<!-- Do not edit manually -->\n`;
  xml += `<resources>\n\n`;

  if (colorTokens.length > 0) {
    xml += `    <!-- ${theme} Colors -->\n`;
    colorTokens.forEach((token) => {
      if (
        typeof token.value === "string" &&
        token.value.startsWith("#") &&
        token.value.length >= 7
      ) {
        const androidName = toAndroidName(token.name);
        xml += `    <!-- ${token.name}: ${token.originalValue} -->\n`;
        xml += `    <color name="${androidName}">${token.value.toUpperCase()}</color>\n`;
      }
    });
  }

  xml += `\n</resources>\n`;
  return xml;
}

// Generate Android XML for dimensions
function generateDimensXML(spacingTokens, borderRadiusTokens) {
  let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
  xml += `<!-- Design System Dimensions - Auto-generated on ${new Date().toLocaleDateString()} -->\n`;
  xml += `<!-- Do not edit manually -->\n`;
  xml += `<resources>\n\n`;

  if (spacingTokens.length > 0) {
    xml += `    <!-- Spacing -->\n`;
    spacingTokens.forEach((token) => {
      if (typeof token.value === "string" || typeof token.value === "number") {
        const androidName = toAndroidName(token.name);
        const value = parseFloat(token.value.toString().replace(/px$/, ""));
        xml += `    <!-- ${token.name}: ${token.originalValue} -->\n`;
        xml += `    <dimen name="${androidName}">${value}dp</dimen>\n`;
      }
    });
  }

  if (borderRadiusTokens.length > 0) {
    xml += `\n    <!-- Border Radius -->\n`;
    borderRadiusTokens.forEach((token) => {
      if (typeof token.value === "string" || typeof token.value === "number") {
        const androidName = toAndroidName(token.name);
        const value = parseFloat(token.value.toString().replace(/px$/, ""));
        xml += `    <!-- ${token.name}: ${token.originalValue} -->\n`;
        xml += `    <dimen name="${androidName}">${value}dp</dimen>\n`;
      }
    });
  }

  xml += `\n</resources>\n`;
  return xml;
}

// Generate Kotlin object for Compose
function generateKotlinObject(
  colorTokensLight,
  colorTokensDark,
  spacingTokens,
  borderRadiusTokens,
  typographyTokens,
) {
  let kotlin = `// Design System Tokens - Auto-generated on ${new Date().toLocaleDateString()}\n`;
  kotlin += `// Do not edit manually\n\n`;
  kotlin += `package com.sonetel.designsystem\n\n`;
  kotlin += `import androidx.compose.ui.graphics.Color\n`;
  kotlin += `import androidx.compose.ui.unit.dp\n`;
  kotlin += `import androidx.compose.ui.unit.sp\n\n`;
  kotlin += `object DesignSystemTokens {\n\n`;

  // Light Colors
  if (colorTokensLight.length > 0) {
    kotlin += `    // Light Colors\n`;
    colorTokensLight.forEach((token) => {
      if (
        typeof token.value === "string" &&
        token.value.startsWith("#") &&
        token.value.length >= 7
      ) {
        const kotlinName = token.name
          .split(/[.\s-]/)
          .map((part, index) =>
            index === 0
              ? part.toLowerCase()
              : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
          )
          .join("");
        const colorValue = token.value.replace("#", "0xFF");
        kotlin += `    // ${token.name}: ${token.originalValue}\n`;
        kotlin += `    val ${kotlinName}Light = Color(${colorValue})\n`;
      }
    });
    kotlin += `\n`;
  }

  // Dark Colors
  if (colorTokensDark.length > 0) {
    kotlin += `    // Dark Colors\n`;
    colorTokensDark.forEach((token) => {
      if (
        typeof token.value === "string" &&
        token.value.startsWith("#") &&
        token.value.length >= 7
      ) {
        const kotlinName = token.name
          .split(/[.\s-]/)
          .map((part, index) =>
            index === 0
              ? part.toLowerCase()
              : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
          )
          .join("");
        const colorValue = token.value.replace("#", "0xFF");
        kotlin += `    // ${token.name}: ${token.originalValue}\n`;
        kotlin += `    val ${kotlinName}Dark = Color(${colorValue})\n`;
      }
    });
    kotlin += `\n`;
  }

  // Spacing
  if (spacingTokens.length > 0) {
    kotlin += `    // Spacing\n`;
    spacingTokens.forEach((token) => {
      if (typeof token.value === "string" || typeof token.value === "number") {
        const kotlinName = token.name
          .split(/[.\s-]/)
          .map((part, index) =>
            index === 0
              ? part.toLowerCase()
              : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
          )
          .join("");
        const value = parseFloat(token.value.toString().replace(/px$/, ""));
        kotlin += `    // ${token.name}: ${token.originalValue}\n`;
        kotlin += `    val ${kotlinName} = ${value}.dp\n`;
      }
    });
    kotlin += `\n`;
  }

  // Border Radius
  if (borderRadiusTokens.length > 0) {
    kotlin += `    // Border Radius\n`;
    borderRadiusTokens.forEach((token) => {
      if (typeof token.value === "string" || typeof token.value === "number") {
        const kotlinName = token.name
          .split(/[.\s-]/)
          .map((part, index) =>
            index === 0
              ? part.toLowerCase()
              : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
          )
          .join("");
        const value = parseFloat(token.value.toString().replace(/px$/, ""));
        kotlin += `    // ${token.name}: ${token.originalValue}\n`;
        kotlin += `    val ${kotlinName} = ${value}.dp\n`;
      }
    });
    kotlin += `\n`;
  }

  kotlin += `}\n`;
  return kotlin;
}

// Main function
async function generateAndroidTokens() {
  console.log("🚀 Starting Android token generation...");

  // Clean and create output directory
  const outputDir = "./dist/android";
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
    console.log("🧹 Cleaned existing Android output");
  }
  fs.mkdirSync(outputDir, { recursive: true });
  console.log("📁 Created fresh dist/android directory");

  try {
    // Load tokens using iOS logic
    const tokens = loadTokens();

    // Generate XML files
    const lightColorsXML = generateColorsXML(tokens.colorTokensLight, false);
    const darkColorsXML = generateColorsXML(tokens.colorTokensDark, true);
    const dimensionsXML = generateDimensXML(
      tokens.spacingTokens,
      tokens.borderRadiusTokens,
    );

    // Create directories
    fs.mkdirSync(path.join(outputDir, "values"), { recursive: true });
    fs.mkdirSync(path.join(outputDir, "values-night"), { recursive: true });

    // Write XML files
    fs.writeFileSync(
      path.join(outputDir, "values", "design_colors.xml"),
      lightColorsXML,
    );
    fs.writeFileSync(
      path.join(outputDir, "values", "design_dimens.xml"),
      dimensionsXML,
    );
    fs.writeFileSync(
      path.join(outputDir, "values-night", "design_colors.xml"),
      darkColorsXML,
    );

    // Generate Kotlin object
    const kotlinObject = generateKotlinObject(
      tokens.colorTokensLight,
      tokens.colorTokensDark,
      tokens.spacingTokens,
      tokens.borderRadiusTokens,
      tokens.typographyTokens,
    );
    fs.writeFileSync(
      path.join(outputDir, "DesignSystemTokens.kt"),
      kotlinObject,
    );

    // Generate stats
    const stats = {
      lightColors: tokens.colorTokensLight.length,
      darkColors: tokens.colorTokensDark.length,
      spacing: tokens.spacingTokens.length,
      borderRadius: tokens.borderRadiusTokens.length,
      typography: tokens.typographyTokens.length,
      totalTokens: tokens.totalTokens,
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync(
      path.join(outputDir, "stats.json"),
      JSON.stringify(stats, null, 2),
    );

    console.log("✅ Generated Android resources:");
    console.log(
      `   • values/design_colors.xml (${stats.lightColors} light colors)`,
    );
    console.log(
      `   • values/design_dimens.xml (${stats.spacing + stats.borderRadius} dimensions)`,
    );
    console.log(
      `   • values-night/design_colors.xml (${stats.darkColors} dark colors)`,
    );
    console.log(`   • DesignSystemTokens.kt (Compose object)`);
    console.log(`📊 Total: ${stats.totalTokens} tokens`);
    console.log("🎉 Android token generation complete!");
    console.log(`📁 Output directory: ${outputDir}/`);
  } catch (error) {
    console.error("❌ Token generation failed:", error.message);
    process.exit(1);
  }
}

// Run the generator
generateAndroidTokens().catch(console.error);
