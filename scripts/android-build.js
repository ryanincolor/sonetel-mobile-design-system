#!/usr/bin/env node

/**
 * Android Design Token Generator
 * Generates Android-specific design tokens using Style Dictionary
 */

import fs from "fs";
import path from "path";
import StyleDictionary from "style-dictionary";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Custom transforms for Android
StyleDictionary.registerTransform({
  name: "name/cti/android",
  type: "name",
  transform: function (token, options) {
    return token.path.join("_").toLowerCase().replace(/-/g, "_");
  },
});

StyleDictionary.registerTransform({
  name: "color/android",
  type: "value",
  filter: function (token) {
    return token.type === "color";
  },
  transform: function (token) {
    const hex = token.value;
    if (hex.startsWith("#")) {
      return hex.toUpperCase();
    }
    return hex;
  },
});

StyleDictionary.registerTransform({
  name: "size/android/dp",
  type: "value",
  filter: function (token) {
    return token.type === "dimension" || token.type === "spacing";
  },
  transform: function (token) {
    const value = parseFloat(token.value);
    return `${value}dp`;
  },
});

StyleDictionary.registerTransform({
  name: "size/android/sp",
  type: "value",
  filter: function (token) {
    return token.type === "fontSizes" || token.type === "fontSize";
  },
  transform: function (token) {
    const value = parseFloat(token.value);
    return `${value}sp`;
  },
});

// Custom formats for Android
StyleDictionary.registerFormat({
  name: "android/resources",
  format: function ({ dictionary, options }) {
    const tokens = dictionary.allTokens;
    const colors = tokens.filter((token) => token.type === "color");
    const dimensions = tokens.filter(
      (token) => token.type === "dimension" || token.type === "spacing",
    );
    const fontSizes = tokens.filter(
      (token) => token.type === "fontSizes" || token.type === "fontSize",
    );

    let output = `<?xml version="1.0" encoding="utf-8"?>\n`;
    output += `<!-- Design System Colors - Auto-generated on ${new Date().toLocaleDateString()} -->\n`;
    output += `<!-- Do not edit manually -->\n`;
    output += `<resources>\n\n`;

    if (colors.length > 0) {
      output += `    <!-- Colors -->\n`;
      colors.forEach((token) => {
        const comment = token.comment ? `    <!-- ${token.comment} -->\n` : "";
        output += `${comment}    <color name="${token.name}">${token.value}</color>\n`;
      });
      output += `\n`;
    }

    if (dimensions.length > 0) {
      output += `    <!-- Dimensions -->\n`;
      dimensions.forEach((token) => {
        const comment = token.comment ? `    <!-- ${token.comment} -->\n` : "";
        output += `${comment}    <dimen name="${token.name}">${token.value}</dimen>\n`;
      });
      output += `\n`;
    }

    if (fontSizes.length > 0) {
      output += `    <!-- Font Sizes -->\n`;
      fontSizes.forEach((token) => {
        const comment = token.comment ? `    <!-- ${token.comment} -->\n` : "";
        output += `${comment}    <dimen name="${token.name}">${token.value}</dimen>\n`;
      });
    }

    output += `</resources>\n`;
    return output;
  },
});

StyleDictionary.registerFormat({
  name: "kotlin/object",
  format: function ({ dictionary, options }) {
    const tokens = dictionary.allTokens;
    const packageName = options.packageName || "com.yourapp.designsystem";
    const className = options.className || "DesignTokens";

    let output = `// Design System Tokens - Auto-generated on ${new Date().toLocaleDateString()}\n`;
    output += `// Do not edit manually\n\n`;
    output += `package ${packageName}\n\n`;
    output += `import androidx.compose.ui.graphics.Color\n`;
    output += `import androidx.compose.ui.unit.dp\n`;
    output += `import androidx.compose.ui.unit.sp\n\n`;
    output += `object ${className} {\n\n`;

    // Colors
    const colors = tokens.filter((token) => token.type === "color");
    if (colors.length > 0) {
      output += `    // Colors\n`;
      colors.forEach((token) => {
        const comment = token.comment ? `    // ${token.comment}\n` : "";
        const kotlinName = token.name
          .split("_")
          .map((part, index) =>
            index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
          )
          .join("");
        const colorValue = token.value.replace("#", "0xFF");
        output += `${comment}    val ${kotlinName} = Color(${colorValue})\n`;
      });
      output += `\n`;
    }

    // Dimensions
    const dimensions = tokens.filter(
      (token) => token.type === "dimension" || token.type === "spacing",
    );
    if (dimensions.length > 0) {
      output += `    // Dimensions\n`;
      dimensions.forEach((token) => {
        const comment = token.comment ? `    // ${token.comment}\n` : "";
        const kotlinName = token.name
          .split("_")
          .map((part, index) =>
            index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
          )
          .join("");
        const value = parseFloat(token.value.replace("dp", ""));
        output += `${comment}    val ${kotlinName} = ${value}.dp\n`;
      });
      output += `\n`;
    }

    // Font Sizes
    const fontSizes = tokens.filter(
      (token) => token.type === "fontSizes" || token.type === "fontSize",
    );
    if (fontSizes.length > 0) {
      output += `    // Typography\n`;
      fontSizes.forEach((token) => {
        const comment = token.comment ? `    // ${token.comment}\n` : "";
        const kotlinName = token.name
          .split("_")
          .map((part, index) =>
            index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
          )
          .join("");
        const value = parseFloat(token.value.replace("sp", ""));
        output += `${comment}    val ${kotlinName} = ${value}.sp\n`;
      });
    }

    output += `}\n`;
    return output;
  },
});

// Token loading utility
function loadTokens() {
  console.log("📖 Loading design tokens...");

  // Load core tokens
  const coreTypography = JSON.parse(
    fs.readFileSync("./tokens/Core/Typography/Value.json", "utf8"),
  );
  const coreSpacing = JSON.parse(
    fs.readFileSync("./tokens/Core/Spacings/Mode 1.json", "utf8"),
  );

  // Load system tokens
  const sysColors = JSON.parse(
    fs.readFileSync("./tokens/Sys/Color/Light.json", "utf8"),
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

  console.log("✅ All token files loaded");

  // Build reference map
  const referenceMap = new Map();

  function addToReferenceMap(obj, prefix = "") {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object" && value.value !== undefined) {
        referenceMap.set(`${prefix}.${key}`, value.value);
      } else if (value && typeof value === "object") {
        addToReferenceMap(value, prefix ? `${prefix}.${key}` : key);
      }
    }
  }

  addToReferenceMap(coreTypography, "font");
  addToReferenceMap(coreSpacing, "spacing");
  addToReferenceMap(sysColors, "color");
  addToReferenceMap(sysSpacing, "spacing");
  addToReferenceMap(sysBorderRadius, "radius");
  addToReferenceMap(sysTypography, "typography");

  console.log(`📊 Built reference map with ${referenceMap.size} entries`);

  // Resolve references
  function resolveReferences(value) {
    if (
      typeof value === "string" &&
      value.startsWith("{") &&
      value.endsWith("}")
    ) {
      const ref = value.slice(1, -1);
      const resolved = referenceMap.get(ref);
      if (resolved) {
        return resolveReferences(resolved);
      }
      console.warn(`⚠️  Unresolved reference: ${ref}`);
      return value;
    }
    return value;
  }

  // Extract and resolve colors
  const colors = {};
  function extractColors(obj, prefix = "") {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object" && value.value !== undefined) {
        const resolvedValue = resolveReferences(value.value);
        if (
          typeof resolvedValue === "string" &&
          resolvedValue.startsWith("#")
        ) {
          const tokenName = prefix ? `${prefix}_${key}` : key;
          colors[tokenName.toLowerCase().replace(/\./g, "_")] = {
            value: resolvedValue,
            type: "color",
            comment: value.description || `${prefix}.${key}`,
          };
        }
      } else if (value && typeof value === "object") {
        extractColors(value, prefix ? `${prefix}_${key}` : key);
      }
    }
  }

  extractColors(sysColors, "color");

  // Extract spacing and dimensions
  const dimensions = {};
  function extractDimensions(obj, prefix = "", type = "dimension") {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object" && value.value !== undefined) {
        const resolvedValue = resolveReferences(value.value);
        if (
          typeof resolvedValue === "string" ||
          typeof resolvedValue === "number"
        ) {
          const tokenName = prefix ? `${prefix}_${key}` : key;
          dimensions[tokenName.toLowerCase().replace(/\./g, "_")] = {
            value: resolvedValue.toString(),
            type: type,
            comment: value.description || `${prefix}.${key}`,
          };
        }
      } else if (value && typeof value === "object") {
        extractDimensions(value, prefix ? `${prefix}_${key}` : key, type);
      }
    }
  }

  extractDimensions(sysSpacing, "spacing", "spacing");
  extractDimensions(sysBorderRadius, "radius", "dimension");

  // Extract typography
  const typography = {};
  function extractTypography(obj, prefix = "") {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object" && value.value !== undefined) {
        const resolvedValue = resolveReferences(value.value);
        if (
          typeof resolvedValue === "string" ||
          typeof resolvedValue === "number"
        ) {
          const tokenName = prefix ? `${prefix}_${key}` : key;
          typography[tokenName.toLowerCase().replace(/\./g, "_")] = {
            value: resolvedValue.toString(),
            type: "fontSize",
            comment: value.description || `${prefix}.${key}`,
          };
        }
      } else if (value && typeof value === "object") {
        extractTypography(value, prefix ? `${prefix}_${key}` : key);
      }
    }
  }

  extractTypography(sysTypography, "typography");

  return {
    color: colors,
    spacing: dimensions,
    typography: typography,
  };
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

    // Transform tokens for Style Dictionary format
    const styleDictionaryTokens = {
      color: {},
      spacing: {},
      typography: {},
    };

    // Add colors
    Object.entries(tokens.color).forEach(([name, token]) => {
      const path = name.split("_");
      let current = styleDictionaryTokens.color;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = token;
    });

    // Add spacing
    Object.entries(tokens.spacing).forEach(([name, token]) => {
      const path = name.split("_");
      let current = styleDictionaryTokens.spacing;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = token;
    });

    // Add typography
    Object.entries(tokens.typography).forEach(([name, token]) => {
      const path = name.split("_");
      let current = styleDictionaryTokens.typography;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = token;
    });

    // Write tokens file for Style Dictionary
    const tokensFile = path.join(outputDir, "tokens.json");
    fs.writeFileSync(
      tokensFile,
      JSON.stringify(styleDictionaryTokens, null, 2),
    );

    // Create Style Dictionary configuration
    const config = {
      source: [tokensFile],
      platforms: {
        android: {
          transformGroup: "android",
          transforms: ["name/cti/android", "color/android", "size/android/dp"],
          buildPath: `${outputDir}/`,
          files: [
            {
              destination: "colors.xml",
              format: "android/resources",
              filter: {
                type: "color",
              },
            },
            {
              destination: "dimens.xml",
              format: "android/resources",
              filter: function (token) {
                return token.type === "dimension" || token.type === "spacing";
              },
            },
            {
              destination: "DesignSystemTokens.kt",
              format: "kotlin/object",
              options: {
                packageName: "com.sonetel.designsystem",
                className: "DesignTokens",
              },
            },
          ],
        },
      },
    };

    // Build tokens with Style Dictionary
    const sd = new StyleDictionary(config);
    await sd.buildAllPlatforms();

    // Generate stats
    const stats = {
      colors: Object.keys(tokens.color).length,
      spacing: Object.keys(tokens.spacing).length,
      typography: Object.keys(tokens.typography).length,
      totalTokens:
        Object.keys(tokens.color).length +
        Object.keys(tokens.spacing).length +
        Object.keys(tokens.typography).length,
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync(
      path.join(outputDir, "stats.json"),
      JSON.stringify(stats, null, 2),
    );

    console.log("🎨 Generated Android resources:");
    console.log(`   • colors.xml (${stats.colors} colors)`);
    console.log(`   • dimens.xml (${stats.spacing} dimensions)`);
    console.log(`   • DesignSystemTokens.kt (Compose object)`);
    console.log(`📊 Total: ${stats.totalTokens} tokens`);
    console.log("🎉 Android token generation complete!");
    console.log(`📁 Output directory: ${outputDir}/`);

    // Clean up temporary tokens file
    fs.unlinkSync(tokensFile);
  } catch (error) {
    console.error("❌ Token generation failed:", error.message);
    process.exit(1);
  }
}

// Run the generator
generateAndroidTokens().catch(console.error);
