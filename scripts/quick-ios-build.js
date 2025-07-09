#!/usr/bin/env node

import fs from "fs";

console.log("🚀 Starting iOS token generation...");

// Clean entire dist directory to remove all old files
if (fs.existsSync("./dist")) {
  fs.rmSync("./dist", { recursive: true, force: true });
  console.log("🧹 Cleaned entire dist directory");
}
fs.mkdirSync("./dist/ios", { recursive: true });
console.log("📁 Created fresh dist/ios directory");

try {
  // Load Core tokens for reference resolution
  console.log("📖 Loading Core tokens...");
  const coreColors = JSON.parse(
    fs.readFileSync("./tokens/Core/Colors/Mode 1.json", "utf8"),
  );

  // Load Core Typography if it exists
  let coreTypography = {};
  try {
    coreTypography = JSON.parse(
      fs.readFileSync("./tokens/Core/Typography/Value.json", "utf8"),
    );
    console.log("📖 Loaded Core Typography");
  } catch (e) {
    console.log("ℹ️  No Core Typography found");
  }

  // Load Core Spacing if it exists
  let coreSpacing = {};
  try {
    coreSpacing = JSON.parse(
      fs.readFileSync("./tokens/Core/Spacings/Mode 1.json", "utf8"),
    );
    console.log("📖 Loaded Core Spacing");
  } catch (e) {
    console.log("ℹ️  No Core Spacing found");
  }

  // Load Sys tokens
  console.log("📖 Loading Sys tokens...");
  const sysColorsLight = JSON.parse(
    fs.readFileSync("./tokens/Sys/Color/Light.json", "utf8"),
  );

  // Load Dark mode colors if available
  let sysColorsDark = null;
  try {
    sysColorsDark = JSON.parse(
      fs.readFileSync("./tokens/Sys/Color/Dark.json", "utf8"),
    );
    console.log("🌙 Loaded Dark mode colors");
  } catch (e) {
    console.log("ℹ️  No Dark mode colors found");
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

  // Build reference map from all Core tokens
  const refs = new Map();
  function mapRefs(obj, prefix = "") {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object" && "value" in value) {
        refs.set(fullKey, value.value);
      } else if (value && typeof value === "object") {
        mapRefs(value, fullKey);
      }
    }
  }

  // Map all Core tokens
  mapRefs(coreColors);
  mapRefs(coreTypography);
  mapRefs(coreSpacing);
  console.log(`📊 Built reference map with ${refs.size} entries`);

  // Resolve a reference
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

  // Extract all token types
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

  // Extract different token types
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
    colorTokensLight.slice(0, 2).forEach((token) => {
      console.log(`  ${token.name}: ${token.originalValue} → ${token.value}`);
    });
  }

  if (colorTokensDark.length > 0) {
    console.log("🌙 Sample dark color tokens:");
    colorTokensDark.slice(0, 2).forEach((token) => {
      console.log(`  ${token.name}: ${token.originalValue} → ${token.value}`);
    });
  }

  if (typographyTokens.length > 0) {
    console.log("📝 Sample typography tokens:");
    typographyTokens.slice(0, 2).forEach((token) => {
      console.log(
        `  ${token.name}: ${token.originalValue} → ${token.value} (${token.originalType})`,
      );
    });
  }

  // Helper function to convert name to Swift property name
  function toSwiftName(name) {
    return name
      .split(".")
      .map((part, index) => {
        if (index === 0) return part.toLowerCase();
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join("")
      .replace(/[^a-zA-Z0-9]/g, "");
  }

  // Helper function to parse hex color to RGB components
  function hexToRGB(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return { r: r.toFixed(3), g: g.toFixed(3), b: b.toFixed(3) };
  }

  // Generate iOS dynamic colors that automatically adapt to light/dark mode
  if (colorTokensLight.length > 0 || colorTokensDark.length > 0) {
    let colorSwift = `// Design Tokens - Adaptive Colors
// Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually
// These colors automatically adapt to light/dark mode using iOS's built-in appearance system

import UIKit

extension UIColor {

    // MARK: - Adaptive Design System Colors

`;

    // Create a map of color names to their light/dark values
    const colorMap = new Map();

    // Add light mode colors
    colorTokensLight.forEach((token) => {
      if (!colorMap.has(token.name)) {
        colorMap.set(token.name, {});
      }
      colorMap.get(token.name).light = token;
    });

    // Add dark mode colors
    colorTokensDark.forEach((token) => {
      if (!colorMap.has(token.name)) {
        colorMap.set(token.name, {});
      }
      colorMap.get(token.name).dark = token;
    });

    // Generate dynamic color properties
    colorMap.forEach((colors, name) => {
      const swiftName = toSwiftName(name);
      const lightToken = colors.light;
      const darkToken = colors.dark;

      // Comments showing references
      let comment = "";
      if (
        lightToken?.originalValue !== lightToken?.value ||
        darkToken?.originalValue !== darkToken?.value
      ) {
        comment = "\n    /// ";
        if (lightToken)
          comment += `Light: ${lightToken.originalValue} → ${lightToken.value}`;
        if (lightToken && darkToken) comment += ", ";
        if (darkToken)
          comment += `Dark: ${darkToken.originalValue} → ${darkToken.value}`;
      }

      if (lightToken && darkToken) {
        // Both light and dark colors available - create dynamic color
        const lightRGB = lightToken.value.startsWith("#")
          ? hexToRGB(lightToken.value)
          : null;
        const darkRGB = darkToken.value.startsWith("#")
          ? hexToRGB(darkToken.value)
          : null;

        if (lightRGB && darkRGB) {
          colorSwift += `${comment}
    static let ${swiftName} = UIColor { traitCollection in
        return traitCollection.userInterfaceStyle == .dark
            ? UIColor(red: ${darkRGB.r}, green: ${darkRGB.g}, blue: ${darkRGB.b}, alpha: 1.0)
            : UIColor(red: ${lightRGB.r}, green: ${lightRGB.g}, blue: ${lightRGB.b}, alpha: 1.0)
    }

`;
        } else {
          // Fallback for non-hex colors
          colorSwift += `${comment}
    static let ${swiftName} = UIColor { traitCollection in
        return traitCollection.userInterfaceStyle == .dark
            ? UIColor(named: "${darkToken.value}") ?? .systemBackground
            : UIColor(named: "${lightToken.value}") ?? .systemBackground
    }

`;
        }
      } else if (lightToken) {
        // Only light color available
        const lightRGB = lightToken.value.startsWith("#")
          ? hexToRGB(lightToken.value)
          : null;
        if (lightRGB) {
          colorSwift += `${comment}
    static let ${swiftName} = UIColor(red: ${lightRGB.r}, green: ${lightRGB.g}, blue: ${lightRGB.b}, alpha: 1.0)

`;
        } else {
          colorSwift += `${comment}
    static let ${swiftName} = UIColor(named: "${lightToken.value}") ?? .systemBackground

`;
        }
      } else if (darkToken) {
        // Only dark color available (unusual case)
        const darkRGB = darkToken.value.startsWith("#")
          ? hexToRGB(darkToken.value)
          : null;
        if (darkRGB) {
          colorSwift += `${comment}
    static let ${swiftName} = UIColor(red: ${darkRGB.r}, green: ${darkRGB.g}, blue: ${darkRGB.b}, alpha: 1.0)

`;
        } else {
          colorSwift += `${comment}
    static let ${swiftName} = UIColor(named: "${darkToken.value}") ?? .systemBackground

`;
        }
      }
    });

    colorSwift += `}

// MARK: - Usage Example
/*
// These colors automatically adapt to light/dark mode:

// Set background color (automatically switches between light/dark)
view.backgroundColor = .solidZ0

// Set text color (automatically adapts)
label.textColor = .onSurfacePrimary

// In SwiftUI, convert to SwiftUI Color:
Color(UIColor.solidZ0)

// The system automatically chooses the appropriate color based on:
// - Current appearance (light/dark)
// - User's system setting
// - App's overrideUserInterfaceStyle setting
*/`;

    fs.writeFileSync("./dist/ios/DesignSystemColors.swift", colorSwift);
    console.log("✅ Generated DesignSystemColors.swift (adaptive colors)");
  }

  // Generate Typography Swift file
  if (typographyTokens.length > 0) {
    let typographySwift = `// Design Tokens - Typography
// Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually

import UIKit

struct DesignSystemTypography {

    // MARK: - Font Sizes

`;

    const fontSizes = typographyTokens.filter(
      (t) =>
        t.name.includes("font-size") ||
        t.name.includes("h1") ||
        t.name.includes("h2") ||
        t.name.includes("h3") ||
        t.originalType === "number",
    );

    fontSizes.forEach((token) => {
      const swiftName = toSwiftName(token.name);
      const comment =
        token.originalValue !== token.value
          ? `\n    /// Reference: ${token.originalValue}`
          : "";

      typographySwift += `${comment}
    static let ${swiftName}: CGFloat = ${token.value}

`;
    });

    // Font weights
    const fontWeights = typographyTokens.filter(
      (t) => t.name.includes("weight") || t.originalType === "text",
    );

    if (fontWeights.length > 0) {
      typographySwift += `
    // MARK: - Font Weights

`;

      fontWeights.forEach((token) => {
        const swiftName = toSwiftName(token.name);
        let weightValue;

        // Map common weight values to UIFont.Weight
        const weightMap = {
          regular: ".regular",
          medium: ".medium",
          semibold: ".semibold",
          bold: ".bold",
          100: ".ultraLight",
          200: ".thin",
          300: ".light",
          400: ".regular",
          500: ".medium",
          600: ".semibold",
          700: ".bold",
          800: ".heavy",
          900: ".black",
        };

        const tokenValue = String(token.value).toLowerCase();
        weightValue = weightMap[tokenValue] || ".regular";

        const comment =
          token.originalValue !== token.value
            ? `\n    /// Reference: ${token.originalValue}`
            : "";

        typographySwift += `${comment}
    static let ${swiftName}: UIFont.Weight = ${weightValue}

`;
      });
    }

    typographySwift += `}

extension UIFont {

    // MARK: - Design System Fonts

    static func systemFont(size: CGFloat, weight: UIFont.Weight = .regular) -> UIFont {
        return UIFont.systemFont(ofSize: size, weight: weight)
    }
}

// MARK: - Usage Example
/*
// Use typography tokens
let titleFont = UIFont.systemFont(
    ofSize: DesignSystemTypography.headlineH1,
    weight: DesignSystemTypography.bodyProminent
)
*/`;

    fs.writeFileSync(
      "./dist/ios/DesignSystemTypography.swift",
      typographySwift,
    );
    console.log("✅ Generated DesignSystemTypography.swift");
  }

  // Generate Spacing Swift file
  if (spacingTokens.length > 0 || borderRadiusTokens.length > 0) {
    let spacingSwift = `// Design Tokens - Spacing & Layout
// Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually

import UIKit

struct DesignSystemSpacing {

`;

    if (spacingTokens.length > 0) {
      spacingSwift += `    // MARK: - Spacing Values

`;

      spacingTokens.forEach((token) => {
        const swiftName = toSwiftName(token.name);
        const comment =
          token.originalValue !== token.value
            ? `\n    /// Reference: ${token.originalValue}`
            : "";

        spacingSwift += `${comment}
    static let ${swiftName}: CGFloat = ${token.value}

`;
      });
    }

    if (borderRadiusTokens.length > 0) {
      spacingSwift += `
    // MARK: - Border Radius Values

`;

      borderRadiusTokens.forEach((token) => {
        const swiftName = toSwiftName(token.name);
        const comment =
          token.originalValue !== token.value
            ? `\n    /// Reference: ${token.originalValue}`
            : "";

        spacingSwift += `${comment}
    static let ${swiftName}: CGFloat = ${token.value}

`;
      });
    }

    spacingSwift += `}

// MARK: - UIEdgeInsets Helper
extension UIEdgeInsets {

    static func all(_ value: CGFloat) -> UIEdgeInsets {
        return UIEdgeInsets(top: value, left: value, bottom: value, right: value)
    }

    static func horizontal(_ value: CGFloat) -> UIEdgeInsets {
        return UIEdgeInsets(top: 0, left: value, bottom: 0, right: value)
    }

    static func vertical(_ value: CGFloat) -> UIEdgeInsets {
        return UIEdgeInsets(top: value, left: 0, bottom: value, right: 0)
    }
}

// MARK: - Usage Example
/*
// Use spacing tokens
view.layer.cornerRadius = DesignSystemSpacing.radiusMd
stackView.spacing = DesignSystemSpacing.spacingLg

// Use insets helper
button.contentEdgeInsets = .all(DesignSystemSpacing.spacingSm)
*/`;

    fs.writeFileSync("./dist/ios/DesignSystemSpacing.swift", spacingSwift);
    console.log("✅ Generated DesignSystemSpacing.swift");
  }

  console.log("🎉 iOS token generation complete!");
  console.log(`📁 Output directory: ./dist/ios/`);

  if (colorTokensLight.length > 0 || colorTokensDark.length > 0) {
    console.log(`   • Colors: DesignSystemColors.swift (adaptive light/dark)`);
  }
  if (typographyTokens.length > 0) {
    console.log(`   • Typography: DesignSystemTypography.swift`);
  }
  if (spacingTokens.length > 0 || borderRadiusTokens.length > 0) {
    console.log(`   • Spacing & Border Radius: DesignSystemSpacing.swift`);
  }
} catch (error) {
  console.error("❌ Error generating iOS tokens:", error.message);
  process.exit(1);
}
