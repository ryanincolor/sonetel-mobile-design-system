#!/usr/bin/env node

/**
 * Android Design Token Generator (Simplified)
 * Generates Android XML resources and Kotlin objects directly from design tokens
 */

import fs from "fs";
import path from "path";

// Token loading utility (using same logic as iOS)
function loadTokens() {
  console.log("📖 Loading Core tokens...");

  // Load core tokens
  const coreTypography = JSON.parse(
    fs.readFileSync("./tokens/Core/Typography/Value.json", "utf8"),
  );
  const coreSpacing = JSON.parse(
    fs.readFileSync("./tokens/Core/Spacings/Mode 1.json", "utf8"),
  );

  console.log("📖 Loaded Core Typography");
  console.log("📖 Loaded Core Spacing");

  console.log("📖 Loading Sys tokens...");

  // Load system tokens
  const sysLightColors = JSON.parse(
    fs.readFileSync("./tokens/Sys/Color/Light.json", "utf8"),
  );
  const sysDarkColors = JSON.parse(
    fs.readFileSync("./tokens/Sys/Color/Dark.json", "utf8"),
  );
  const sysSpacing = JSON.parse(
    fs.readFileSync("./tokens/Sys/Spacing.json", "utf8"),
  );
  const sysBorderRadius = JSON.parse(
    fs.readFileSync("./tokens/Sys/Border Radius.json", "utf8"),
  );
  const sysTypography = JSON.parse(
    fs.readFileSync("./tokens/Sys/Typography.json", "utf8"),
  );

  console.log("🌙 Loaded Light and Dark mode colors");
  console.log("✅ All token files loaded successfully");

  // Build comprehensive reference map using same logic as iOS
  const referenceMap = new Map();

  function addToReferenceMap(obj, prefix = "") {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object" && value.value !== undefined) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        referenceMap.set(fullKey, value.value);
      } else if (value && typeof value === "object") {
        addToReferenceMap(value, prefix ? `${prefix}.${key}` : key);
      }
    }
  }

  // Add all token mappings
  addToReferenceMap(coreTypography, "font");
  addToReferenceMap(coreSpacing, "spacing");
  addToReferenceMap(sysLightColors, "");
  addToReferenceMap(sysDarkColors, "");
  addToReferenceMap(sysSpacing, "spacing");
  addToReferenceMap(sysBorderRadius, "radius");
  addToReferenceMap(sysTypography, "typography");

  // Also load archived colors for reference resolution
  try {
    const archiveLightColors = JSON.parse(
      fs.readFileSync("./tokens/Core/Archive/Color/Light.json", "utf8"),
    );
    const archiveDarkColors = JSON.parse(
      fs.readFileSync("./tokens/Core/Archive/Color/Dark.json", "utf8"),
    );
    addToReferenceMap(archiveLightColors, "");
    addToReferenceMap(archiveDarkColors, "");
  } catch (e) {
    console.log("ℹ️  Archive colors not loaded");
  }

  console.log(`📊 Built reference map with ${referenceMap.size} entries`);

  return {
    light: sysLightColors,
    dark: sysDarkColors,
    spacing: sysSpacing,
    borderRadius: sysBorderRadius,
    typography: sysTypography,
    referenceMap,
  };
}

// Resolve token references
function resolveReferences(value, referenceMap) {
  if (
    typeof value === "string" &&
    value.startsWith("{") &&
    value.endsWith("}")
  ) {
    const ref = value.slice(1, -1);
    const resolved = referenceMap.get(ref);
    if (resolved) {
      return resolveReferences(resolved, referenceMap);
    }
    // Try without the leading part for archived colors
    const simplifiedRef = ref.split(".").slice(-2).join(".");
    const resolvedSimple = referenceMap.get(simplifiedRef);
    if (resolvedSimple) {
      return resolveReferences(resolvedSimple, referenceMap);
    }
    console.warn(`⚠️  Unresolved reference: ${ref}`);
    return value;
  }
  return value;
}

// Extract colors from token object
function extractColors(obj, referenceMap, prefix = "") {
  const colors = {};

  function traverse(obj, currentPrefix = "") {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object" && value.value !== undefined) {
        const resolvedValue = resolveReferences(value.value, referenceMap);
        if (
          typeof resolvedValue === "string" &&
          resolvedValue.startsWith("#")
        ) {
          const tokenName = currentPrefix ? `${currentPrefix}_${key}` : key;
          colors[tokenName.toLowerCase().replace(/[.\s]/g, "_")] = {
            value: resolvedValue,
            description: value.description || `${currentPrefix}.${key}`,
            originalPath: `${currentPrefix}.${key}`,
          };
        }
      } else if (value && typeof value === "object") {
        traverse(value, currentPrefix ? `${currentPrefix}_${key}` : key);
      }
    }
  }

  traverse(obj, prefix);
  return colors;
}

// Extract dimensions (spacing, border radius)
function extractDimensions(obj, referenceMap, prefix = "") {
  const dimensions = {};

  function traverse(obj, currentPrefix = "") {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object" && value.value !== undefined) {
        const resolvedValue = resolveReferences(value.value, referenceMap);
        if (
          typeof resolvedValue === "string" ||
          typeof resolvedValue === "number"
        ) {
          const tokenName = currentPrefix ? `${currentPrefix}_${key}` : key;
          dimensions[tokenName.toLowerCase().replace(/[.\s]/g, "_")] = {
            value: resolvedValue.toString(),
            description: value.description || `${currentPrefix}.${key}`,
            originalPath: `${currentPrefix}.${key}`,
          };
        }
      } else if (value && typeof value === "object") {
        traverse(value, currentPrefix ? `${currentPrefix}_${key}` : key);
      }
    }
  }

  traverse(obj, prefix);
  return dimensions;
}

// Generate Android XML resources for colors only
function generateAndroidColorsXML(colors, isDark = false) {
  let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
  xml += `<!-- Design System ${isDark ? "Dark" : "Light"} Colors - Auto-generated on ${new Date().toLocaleDateString()} -->\n`;
  xml += `<!-- Do not edit manually -->\n`;
  xml += `<resources>\n\n`;

  if (Object.keys(colors).length > 0) {
    xml += `    <!-- Colors -->\n`;
    Object.entries(colors).forEach(([name, token]) => {
      xml += `    <!-- ${token.description} -->\n`;
      xml += `    <color name="${name}">${token.value}</color>\n`;
    });
  }

  xml += `\n</resources>\n`;
  return xml;
}

// Generate Android XML resources for dimensions only
function generateAndroidDimensXML(dimensions) {
  let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
  xml += `<!-- Design System Dimensions - Auto-generated on ${new Date().toLocaleDateString()} -->\n`;
  xml += `<!-- Do not edit manually -->\n`;
  xml += `<resources>\n\n`;

  if (Object.keys(dimensions).length > 0) {
    xml += `    <!-- Spacing -->\n`;
    Object.entries(dimensions)
      .filter(([name]) => name.includes("spacing"))
      .forEach(([name, token]) => {
        const value = parseFloat(token.value);
        xml += `    <!-- ${token.description} -->\n`;
        xml += `    <dimen name="${name}">${value}dp</dimen>\n`;
      });

    xml += `\n    <!-- Border Radius -->\n`;
    Object.entries(dimensions)
      .filter(([name]) => name.includes("radius"))
      .forEach(([name, token]) => {
        const value = parseFloat(token.value);
        xml += `    <!-- ${token.description} -->\n`;
        xml += `    <dimen name="${name}">${value}dp</dimen>\n`;
      });
  }

  xml += `\n</resources>\n`;
  return xml;
}

// Generate Kotlin object for Compose
function generateKotlinObject(lightColors, darkColors, dimensions) {
  let kotlin = `// Design System Tokens - Auto-generated on ${new Date().toLocaleDateString()}\n`;
  kotlin += `// Do not edit manually\n\n`;
  kotlin += `package com.sonetel.designsystem\n\n`;
  kotlin += `import androidx.compose.ui.graphics.Color\n`;
  kotlin += `import androidx.compose.ui.unit.dp\n`;
  kotlin += `import androidx.compose.ui.unit.sp\n\n`;
  kotlin += `object DesignSystemTokens {\n\n`;

  // Light Colors
  if (Object.keys(lightColors).length > 0) {
    kotlin += `    // Light Colors\n`;
    Object.entries(lightColors).forEach(([name, token]) => {
      const kotlinName = name
        .split("_")
        .map((part, index) =>
          index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
        )
        .join("");
      const colorValue = token.value.replace("#", "0xFF");
      kotlin += `    // ${token.description}\n`;
      kotlin += `    val ${kotlinName}Light = Color(${colorValue})\n`;
    });
    kotlin += `\n`;
  }

  // Dark Colors
  if (Object.keys(darkColors).length > 0) {
    kotlin += `    // Dark Colors\n`;
    Object.entries(darkColors).forEach(([name, token]) => {
      const kotlinName = name
        .split("_")
        .map((part, index) =>
          index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
        )
        .join("");
      const colorValue = token.value.replace("#", "0xFF");
      kotlin += `    // ${token.description}\n`;
      kotlin += `    val ${kotlinName}Dark = Color(${colorValue})\n`;
    });
    kotlin += `\n`;
  }

  // Dimensions
  if (Object.keys(dimensions).length > 0) {
    kotlin += `    // Dimensions\n`;
    Object.entries(dimensions).forEach(([name, token]) => {
      const kotlinName = name
        .split("_")
        .map((part, index) =>
          index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
        )
        .join("");
      const value = parseFloat(token.value);
      kotlin += `    // ${token.description}\n`;
      kotlin += `    val ${kotlinName} = ${value}.dp\n`;
    });
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
    // Load tokens
    const tokens = loadTokens();

    // Extract colors
    const lightColors = extractColors(tokens.light, tokens.referenceMap, "");
    const darkColors = extractColors(tokens.dark, tokens.referenceMap, "");

    // Extract dimensions
    const spacing = extractDimensions(
      tokens.spacing,
      tokens.referenceMap,
      "spacing",
    );
    const borderRadius = extractDimensions(
      tokens.borderRadius,
      tokens.referenceMap,
      "radius",
    );
    const dimensions = { ...spacing, ...borderRadius };

    console.log(`🎨 Extracted ${Object.keys(lightColors).length} light colors`);
    console.log(`🌙 Extracted ${Object.keys(darkColors).length} dark colors`);
    console.log(`📏 Extracted ${Object.keys(dimensions).length} dimensions`);

    // Generate Android XML files separately
    const lightColorsXML = generateAndroidColorsXML(lightColors, false);
    const darkColorsXML = generateAndroidColorsXML(darkColors, true);
    const dimensionsXML = generateAndroidDimensXML(dimensions);

    // Create values directories
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
      lightColors,
      darkColors,
      dimensions,
    );
    fs.writeFileSync(
      path.join(outputDir, "DesignSystemTokens.kt"),
      kotlinObject,
    );

    // Generate stats
    const stats = {
      lightColors: Object.keys(lightColors).length,
      darkColors: Object.keys(darkColors).length,
      dimensions: Object.keys(dimensions).length,
      totalTokens:
        Object.keys(lightColors).length +
        Object.keys(darkColors).length +
        Object.keys(dimensions).length,
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync(
      path.join(outputDir, "stats.json"),
      JSON.stringify(stats, null, 2),
    );

    console.log("✅ Generated Android resources:");
    console.log(
      `   • values/design_colors.xml (${stats.lightColors} light colors + ${stats.dimensions} dimensions)`,
    );
    console.log(
      `   • values-night/design_colors.xml (${stats.darkColors} dark colors)`,
    );
    console.log(`   • DesignSystemTokens.kt (Compose object)`);
    console.log(`���� Total: ${stats.totalTokens} tokens`);
    console.log("🎉 Android token generation complete!");
    console.log(`📁 Output directory: ${outputDir}/`);

    // Show sample tokens
    const sampleLightColors = Object.entries(lightColors).slice(0, 3);
    const sampleDarkColors = Object.entries(darkColors).slice(0, 3);
    const sampleDimensions = Object.entries(dimensions).slice(0, 3);

    console.log("🎨 Sample light colors:");
    sampleLightColors.forEach(([name, token]) => {
      console.log(`  ${name}: ${token.originalPath} → ${token.value}`);
    });

    console.log("🌙 Sample dark colors:");
    sampleDarkColors.forEach(([name, token]) => {
      console.log(`  ${name}: ${token.originalPath} → ${token.value}`);
    });

    console.log("📏 Sample dimensions:");
    sampleDimensions.forEach(([name, token]) => {
      console.log(`  ${name}: ${token.originalPath} → ${token.value}dp`);
    });
  } catch (error) {
    console.error("❌ Token generation failed:", error.message);
    process.exit(1);
  }
}

// Run the generator
generateAndroidTokens().catch(console.error);
