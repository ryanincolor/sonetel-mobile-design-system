#!/usr/bin/env node

/**
 * Unified Token Builder for iOS and Android
 * Follows best practices for both platforms and ensures consistency
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("🚀 Starting unified token generation for iOS and Android...");

// Clean any legacy build locations first
cleanLegacyFiles();

// Clean output directories - remove ALL old files
const outputDir = "./build";
if (fs.existsSync(outputDir)) {
  console.log("🧹 Removing old build files...");
  const files = fs.readdirSync(outputDir, { recursive: true });
  console.log(`   Found ${files.length} existing files to remove`);
  fs.rmSync(outputDir, { recursive: true, force: true });
  console.log("✅ Cleaned existing output completely");
} else {
  console.log("📁 No existing build directory found");
}

// Create fresh directory structure
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(`${outputDir}/ios`, { recursive: true });
fs.mkdirSync(`${outputDir}/android/values`, { recursive: true });
fs.mkdirSync(`${outputDir}/android/values-night`, { recursive: true });

console.log("📁 Created fresh output directories");

// Load and process tokens
const tokens = loadAndProcessTokens();

// Generate platform-specific files
generateIOSFiles(tokens);
generateIOSComponents();
generateAndroidFiles(tokens);

// Generate mobile component specifications
generateMobileComponentSpecs();

// Generate stats
generateStats(tokens);

console.log("🎉 All platform tokens generated successfully!");
console.log(`📁 Output: ${outputDir}/`);

// Show summary of generated files
showGeneratedFilesSummary(outputDir);

function cleanLegacyFiles() {
  const legacyPaths = [
    "./dist",
    "./design-system",
    "./mobile-components/dist", // In case any nested dist folders exist
  ];

  let cleanedAny = false;

  legacyPaths.forEach((path) => {
    if (fs.existsSync(path)) {
      console.log(`🧹 Removing legacy files from ${path}...`);
      try {
        const files = fs.readdirSync(path, { recursive: true });
        console.log(`   Found ${files.length} legacy files to remove`);
        fs.rmSync(path, { recursive: true, force: true });
        console.log(`✅ Cleaned legacy path: ${path}`);
        cleanedAny = true;
      } catch (error) {
        console.log(`   ⚠️  Could not clean ${path}: ${error.message}`);
      }
    }
  });

  if (!cleanedAny) {
    console.log("✨ No legacy files found - build directory is clean");
  }
}

function showGeneratedFilesSummary(outputDir) {
  try {
    const allFiles = [];

    function collectFiles(dir, prefix = "") {
      const items = fs.readdirSync(dir);
      items.forEach((item) => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          collectFiles(fullPath, prefix + item + "/");
        } else {
          allFiles.push(prefix + item);
        }
      });
    }

    collectFiles(outputDir);

    console.log(`\n📊 Generated Files Summary:`);
    console.log(`   Total files: ${allFiles.length}`);

    const byExtension = {};
    allFiles.forEach((file) => {
      const ext = path.extname(file) || "no extension";
      byExtension[ext] = (byExtension[ext] || 0) + 1;
    });

    Object.entries(byExtension).forEach(([ext, count]) => {
      console.log(`   ${ext}: ${count} files`);
    });

    console.log(`\n📱 Platform Breakdown:`);
    const iosFiles = allFiles.filter((f) => f.startsWith("ios/")).length;
    const androidFiles = allFiles.filter((f) =>
      f.startsWith("android/"),
    ).length;
    const componentFiles = allFiles.filter((f) =>
      f.startsWith("mobile-components/"),
    ).length;

    console.log(`   iOS: ${iosFiles} files`);
    console.log(`   Android: ${androidFiles} files`);
    console.log(`   Components: ${componentFiles} files`);
  } catch (error) {
    console.log("   ⚠️ Could not generate summary:", error.message);
  }
}

function loadAndProcessTokens() {
  console.log("📖 Loading and processing design tokens...");

  // Load all token files
  const coreTypography = loadJSON("./tokens/Core/Typography.json");
  const coreSpacing = loadJSON("./tokens/Core/Spacings.json");
  const coreIcons = loadJSON("./tokens/Core/Icons.json");
  const sysLightColors = loadJSON("./tokens/Sys/Color/Light.json");
  const sysDarkColors = loadJSON("./tokens/Sys/Color/Dark.json");
  const sysTypography = loadJSON("./tokens/Sys/Typography.json");
  const sysSpacing = loadJSON("./tokens/Sys/Spacing.json");
  const sysBorderRadius = loadJSON("./tokens/Sys/Border Radius.json");

  // Build reference map for resolution
  const refs = new Map();
  buildReferenceMap(coreTypography, refs); // Core Typography already has "font" prefix in the JSON structure
  buildReferenceMap(coreSpacing, refs, "spacing");
  buildReferenceMap(coreIcons, refs);

  // Load core colors for reference resolution (contains Neutral, Archive colors)
  try {
    const coreColors = loadJSON("./tokens/Core/Colors.json");
    buildReferenceMap(coreColors, refs);
    console.log("✅ Loaded Core Colors for reference resolution");
  } catch (e) {
    console.log(
      "⚠️  Core colors not found, references may not resolve properly",
    );
  }

  buildReferenceMap(sysLightColors, refs);
  buildReferenceMap(sysDarkColors, refs);
  buildReferenceMap(sysTypography, refs);
  buildReferenceMap(sysSpacing, refs);
  buildReferenceMap(sysBorderRadius, refs);

  console.log(`📊 Built reference map with ${refs.size} entries`);

  // Extract tokens
  const lightColors = extractTokens(sysLightColors, "color", "Light");
  const darkColors = extractTokens(sysDarkColors, "color", "Dark");
  const typography = extractTokens(sysTypography, "typography");
  const spacing = extractTokens(sysSpacing, "spacing");
  const borderRadius = extractTokens(sysBorderRadius, "borderRadius");

  // Resolve references
  const allTokens = [
    ...lightColors,
    ...darkColors,
    ...typography,
    ...spacing,
    ...borderRadius,
  ];
  allTokens.forEach((token) => {
    token.value = resolveReferences(token.value, refs);
  });

  console.log(`🎨 Processed ${lightColors.length} light colors`);
  console.log(`🌙 Processed ${darkColors.length} dark colors`);
  console.log(`📝 Processed ${typography.length} typography tokens`);
  console.log(`📏 Processed ${spacing.length} spacing tokens`);
  console.log(`🔘 Processed ${borderRadius.length} border radius tokens`);

  return {
    lightColors,
    darkColors,
    typography,
    spacing,
    borderRadius,
    totalTokens: allTokens.length,
  };
}

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Token file not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function buildReferenceMap(obj, refs, prefix = "") {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && "value" in value) {
      refs.set(fullKey, value.value);
    } else if (value && typeof value === "object") {
      buildReferenceMap(value, refs, fullKey);
    }
  }
}

function extractTokens(obj, type, mode = null, prefix = "") {
  const tokens = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (
      value &&
      typeof value === "object" &&
      "value" in value &&
      "type" in value
    ) {
      tokens.push({
        name: fullKey,
        value: value.value,
        type: type,
        mode: mode,
        originalValue: value.value,
      });
    } else if (value && typeof value === "object") {
      tokens.push(...extractTokens(value, type, mode, fullKey));
    }
  }

  return tokens;
}

function resolveReferences(value, refs) {
  if (
    typeof value === "string" &&
    value.startsWith("{") &&
    value.endsWith("}")
  ) {
    const ref = value.slice(1, -1);
    const resolved = refs.get(ref);
    if (resolved) {
      return resolveReferences(resolved, refs);
    }
    // Try simplified reference for archived colors
    const parts = ref.split(".");
    if (parts.length > 1) {
      const simplifiedRef = parts.slice(-2).join(".");
      const resolvedSimple = refs.get(simplifiedRef);
      if (resolvedSimple) {
        return resolveReferences(resolvedSimple, refs);
      }
    }
    console.warn(`⚠️  Unresolved reference: ${ref}`);
  }
  return value;
}

function generateIOSFiles(tokens) {
  console.log("📱 Generating iOS Swift files...");

  // Generate adaptive colors
  generateIOSColors(tokens.lightColors, tokens.darkColors);

  // Generate typography
  generateIOSTypography(tokens.typography);

  // Generate spacing
  generateIOSSpacing(tokens.spacing, tokens.borderRadius);

  console.log("✅ iOS files generated");
}

function generateIOSColors(lightColors, darkColors) {
  const colorMap = new Map();

  // Build color pairs
  lightColors.forEach((token) => {
    if (token.value.startsWith("#")) {
      colorMap.set(token.name, { light: token });
    }
  });

  darkColors.forEach((token) => {
    if (token.value.startsWith("#") && colorMap.has(token.name)) {
      colorMap.get(token.name).dark = token;
    }
  });

  let swift = `// Design System Colors - iOS Best Practices
// Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually
// Supports iOS 13+ with automatic dark mode adaptation

import UIKit

extension UIColor {
    
    // MARK: - Sonetel Design System Colors
    
`;

  colorMap.forEach((colors, name) => {
    const swiftName = toSwiftName(name);
    const light = colors.light;
    const dark = colors.dark || colors.light; // Fallback to light if no dark variant

    const lightRGB = hexToRGB(light.value);
    const darkRGB = hexToRGB(dark.value);

    swift += `    /// ${name} - Adaptive color\n`;
    swift += `    /// Light: ${light.value} | Dark: ${dark.value}\n`;
    swift += `    static let ${swiftName} = UIColor { traitCollection in\n`;
    swift += `        return traitCollection.userInterfaceStyle == .dark\n`;
    swift += `            ? UIColor(red: ${darkRGB.r}, green: ${darkRGB.g}, blue: ${darkRGB.b}, alpha: 1.0)\n`;
    swift += `            : UIColor(red: ${lightRGB.r}, green: ${lightRGB.g}, blue: ${lightRGB.b}, alpha: 1.0)\n`;
    swift += `    }\n\n`;
  });

  swift += `}

// MARK: - SwiftUI Support
#if canImport(SwiftUI)
import SwiftUI

@available(iOS 13.0, *)
extension Color {
    
`;

  colorMap.forEach((colors, name) => {
    const swiftName = toSwiftName(name);
    swift += `    /// ${name} - SwiftUI Color\n`;
    swift += `    static let ${swiftName} = Color(UIColor.${swiftName})\n`;
  });

  swift += `
}
#endif

// MARK: - Usage Examples
/*
// UIKit
view.backgroundColor = .solidZ0
label.textColor = .onSurfacePrimary

// SwiftUI
Color.solidZ0
Text("Hello").foregroundColor(.onSurfacePrimary)
*/`;

  fs.writeFileSync("./build/ios/DesignSystemColors.swift", swift);
}

function generateIOSTypography(typography) {
  let swift = `// Design System Typography - iOS Best Practices
// Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually

import UIKit

public struct DesignSystemTypography {
    
    // MARK: - Font Sizes (Dynamic Type Compatible)
    
`;

  typography.forEach((token) => {
    if (token.value && !isNaN(parseFloat(token.value))) {
      const swiftName = toSwiftName(token.name);
      const size = parseFloat(token.value);
      swift += `    /// ${token.name}\n`;
      swift += `    public static let ${swiftName}: CGFloat = ${size}\n`;
    }
  });

  swift += `
    
    // MARK: - Convenience Methods
    
    /// Get system font with design system size
    public static func systemFont(size: CGFloat, weight: UIFont.Weight = .regular) -> UIFont {
        return UIFont.systemFont(ofSize: size, weight: weight)
    }
    
    /// Get rounded system font with design system size
    public static func roundedSystemFont(size: CGFloat, weight: UIFont.Weight = .regular) -> UIFont {
        return UIFont.systemFont(ofSize: size, weight: weight, width: .standard)
    }
}

// MARK: - SwiftUI Support
#if canImport(SwiftUI)
import SwiftUI

@available(iOS 13.0, *)
extension Font {
    
`;

  typography.forEach((token) => {
    if (token.value && !isNaN(parseFloat(token.value))) {
      const swiftName = toSwiftName(token.name);
      swift += `    /// ${token.name}\n`;
      swift += `    static let ${swiftName} = Font.system(size: DesignSystemTypography.${swiftName})\n`;
    }
  });

  swift += `
}
#endif`;

  fs.writeFileSync("./build/ios/DesignSystemTypography.swift", swift);
}

function generateIOSSpacing(spacing, borderRadius) {
  let swift = `// Design System Spacing - iOS Best Practices
// Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually

import UIKit

public struct DesignSystemSpacing {
    
    // MARK: - Spacing Values
    
`;

  spacing.forEach((token) => {
    if (token.value && !isNaN(parseFloat(token.value))) {
      const swiftName = toSwiftName(token.name);
      const value = parseFloat(token.value);
      swift += `    /// ${token.name}\n`;
      swift += `    public static let ${swiftName}: CGFloat = ${value}\n`;
    }
  });

  swift += `
    
    // MARK: - Border Radius Values
    
`;

  borderRadius.forEach((token) => {
    if (token.value && !isNaN(parseFloat(token.value))) {
      const swiftName = toSwiftName(token.name);
      const value = parseFloat(token.value);
      swift += `    /// ${token.name}\n`;
      swift += `    public static let ${swiftName}: CGFloat = ${value}\n`;
    }
  });

  swift += `
}

// MARK: - UIEdgeInsets Extensions
extension UIEdgeInsets {
    
    /// Create insets with same value for all sides
    public static func all(_ value: CGFloat) -> UIEdgeInsets {
        return UIEdgeInsets(top: value, left: value, bottom: value, right: value)
    }
    
    /// Create horizontal insets
    public static func horizontal(_ value: CGFloat) -> UIEdgeInsets {
        return UIEdgeInsets(top: 0, left: value, bottom: 0, right: value)
    }
    
    /// Create vertical insets
    public static func vertical(_ value: CGFloat) -> UIEdgeInsets {
        return UIEdgeInsets(top: value, left: 0, bottom: value, right: 0)
    }
}`;

  fs.writeFileSync("./build/ios/DesignSystemSpacing.swift", swift);
}

function generateAndroidFiles(tokens) {
  console.log("���� Generating Android files...");

  // Generate XML resources
  generateAndroidColors(tokens.lightColors, tokens.darkColors);
  generateAndroidDimens(tokens.spacing, tokens.borderRadius);

  // Generate Compose object
  generateAndroidCompose(tokens);

  // Generate Material 3 theme, typography, and shapes
  generateMaterial3Theme(tokens);
  generateMaterial3Typography(tokens);
  generateMaterial3Shapes(tokens);
  generateMaterial3ThemeIntegration();

  // Generate actual component files
  generateAndroidComponents();

  // Generate component manifest for version tracking
  generateComponentManifest();

  console.log("✅ Android files generated");
}

function generateAndroidColors(lightColors, darkColors) {
  // Light colors
  let lightXML = `<?xml version="1.0" encoding="utf-8"?>
<!-- Sonetel Design System - Light Colors -->
<!-- Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually -->
<resources>

`;

  lightColors.forEach((token) => {
    if (token.value.startsWith("#")) {
      const androidName = toAndroidName(token.name);
      lightXML += `    <!-- ${token.name} -->\n`;
      lightXML += `    <color name="${androidName}">${token.value.toUpperCase()}</color>\n`;
    }
  });

  lightXML += `
</resources>`;

  // Dark colors
  let darkXML = `<?xml version="1.0" encoding="utf-8"?>
<!-- Sonetel Design System - Dark Colors -->
<!-- Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually -->
<resources>

`;

  darkColors.forEach((token) => {
    if (token.value.startsWith("#")) {
      const androidName = toAndroidName(token.name);
      darkXML += `    <!-- ${token.name} -->\n`;
      darkXML += `    <color name="${androidName}">${token.value.toUpperCase()}</color>\n`;
    }
  });

  darkXML += `
</resources>`;

  fs.writeFileSync("./build/android/values/design_colors.xml", lightXML);
  fs.writeFileSync("./build/android/values-night/design_colors.xml", darkXML);
}

function generateAndroidDimens(spacing, borderRadius) {
  let xml = `<?xml version="1.0" encoding="utf-8"?>
<!-- Sonetel Design System - Dimensions -->
<!-- Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually -->
<resources>

    <!-- Spacing -->
`;

  spacing.forEach((token) => {
    if (token.value && !isNaN(parseFloat(token.value))) {
      const androidName = toAndroidName(token.name);
      const value = parseFloat(token.value);
      xml += `    <!-- ${token.name} -->\n`;
      xml += `    <dimen name="${androidName}">${value}dp</dimen>\n`;
    }
  });

  xml += `
    <!-- Border Radius -->
`;

  borderRadius.forEach((token) => {
    if (token.value && !isNaN(parseFloat(token.value))) {
      const androidName = toAndroidName(token.name);
      const value = parseFloat(token.value);
      xml += `    <!-- ${token.name} -->\n`;
      xml += `    <dimen name="${androidName}">${value}dp</dimen>\n`;
    }
  });

  xml += `
</resources>`;

  fs.writeFileSync("./build/android/values/design_dimens.xml", xml);
}

function generateAndroidCompose(tokens) {
  let kotlin = `// Sonetel Design System - Jetpack Compose
// Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually

package com.sonetel.designsystem

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * Sonetel Design System tokens for Jetpack Compose
 * Use these tokens to maintain consistency across the app
 */
object SonetelDesignTokens {

    // MARK: - Light Colors
`;

  tokens.lightColors.forEach((token) => {
    if (token.value.startsWith("#")) {
      const kotlinName = toKotlinName(token.name);
      const colorValue = token.value.replace("#", "0xFF");
      kotlin += `    
    /** ${token.name} */
    val ${kotlinName}Light = Color(${colorValue})`;
    }
  });

  kotlin += `

    // MARK: - Dark Colors
`;

  tokens.darkColors.forEach((token) => {
    if (token.value.startsWith("#")) {
      const kotlinName = toKotlinName(token.name);
      const colorValue = token.value.replace("#", "0xFF");
      kotlin += `    
    /** ${token.name} */
    val ${kotlinName}Dark = Color(${colorValue})`;
    }
  });

  kotlin += `

        // MARK: - Font Weights
    val fontWeightRegular = FontWeight.Normal
    val fontWeightMedium = FontWeight.Medium
    val fontWeightBold = FontWeight.SemiBold
    val fontWeightXBold = FontWeight.Bold

    // MARK: - Spacing
`;

  tokens.spacing.forEach((token) => {
    if (token.value && !isNaN(parseFloat(token.value))) {
      const kotlinName = toKotlinName(token.name);
      const value = parseFloat(token.value);
      kotlin += `    
    /** ${token.name} */
    val ${kotlinName} = ${value}.dp`;
    }
  });

  kotlin += `

                // MARK: - Font Sizes
    val fontSizeXxs = 11.sp
    val fontSizeXs = 12.sp
    val fontSizeSm = 14.sp
    val fontSizeMd = 16.sp
    val fontSizeBase = 18.sp    // Headline small
    val fontSizeLg = 20.sp      // Headline medium
    val fontSizeXl = 24.sp      // Headline large
    val fontSize2xl = 28.sp     // Headline XL
    val fontSize3xl = 34.sp     // Headline 2xl
    val fontSize4xl = 40.sp     // Headline 3xl
    val fontSize5xl = 64.sp     // Display medium

    // MARK: - Line Heights
    val lineHeight64 = 64.sp    // Display medium
    val lineHeight46 = 46.sp    // Headline 3xl
    val lineHeight40 = 40.sp    // Headline 2xl
    val lineHeight32 = 32.sp    // Headline XL
    val lineHeight29 = 29.sp    // Headline large
    val lineHeight24 = 24.sp    // Headline medium
    val lineHeight22 = 22.sp    // Headline small
    val lineHeight20 = 20.sp    // Body/Label medium
    val lineHeight16 = 16.sp    // Body/Label small

    // MARK: - Letter Spacing
    val letterSpacingTight = (-0.02).sp  // -2% for headings
    val letterSpacingNormal = 0.sp
    val letterSpacingWide = 0.02.sp

    // MARK: - Border Radius
`;

  tokens.borderRadius.forEach((token) => {
    if (token.value && !isNaN(parseFloat(token.value))) {
      const kotlinName = toKotlinName(token.name);
      const value = parseFloat(token.value);
      kotlin += `    
    /** ${token.name} */
    val ${kotlinName} = ${value}.dp`;
    }
  });

  kotlin += `

    // MARK: - Border Radius Aliases
    val borderRadiusSmall = small
    val borderRadiusMedium = medium
    val borderRadiusLarge = large

    // MARK: - Accent Blue Aliases (for legacy compatibility)
    val accentsBluLight = accentsBlueLight
    val accentsBlueDark = accentsBlueDark
}`;

  fs.writeFileSync("./build/android/SonetelDesignTokens.kt", kotlin);
}

function generateMaterial3Theme(tokens) {
  let kotlin = `// Sonetel Material 3 Theme
// Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually

package com.sonetel.ui.theme

import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import com.sonetel.designsystem.SonetelDesignTokens

/**
 * Material 3 color schemes using Sonetel design tokens
 */
object SonetelColorScheme {

    val LightColorScheme = lightColorScheme(
        primary = SonetelDesignTokens.accentsBluLight,
        onPrimary = SonetelDesignTokens.solidZ0Light,
        surface = SonetelDesignTokens.solidZ0Light,
        onSurface = SonetelDesignTokens.onSurfaceOnSurfacePrimaryLight,
        background = SonetelDesignTokens.solidZ0Light,
        onBackground = SonetelDesignTokens.onSurfaceOnSurfacePrimaryLight,
        // Add more Material 3 color mappings as needed
    )

    val DarkColorScheme = darkColorScheme(
        primary = SonetelDesignTokens.accentsBluDark,
        onPrimary = SonetelDesignTokens.solidZ0Dark,
        surface = SonetelDesignTokens.solidZ0Dark,
        onSurface = SonetelDesignTokens.onSurfaceOnSurfacePrimaryDark,
        background = SonetelDesignTokens.solidZ0Dark,
        onBackground = SonetelDesignTokens.onSurfaceOnSurfacePrimaryDark,
        // Add more Material 3 color mappings as needed
    )
}`;

  fs.writeFileSync("./build/android/SonetelColorScheme.kt", kotlin);
}

function generateMaterial3Typography(tokens) {
  let kotlin = `// Sonetel Material 3 Typography
// Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually

package com.sonetel.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.sonetel.designsystem.SonetelDesignTokens

/**
 * Material 3 Typography using Sonetel design tokens
 * Provides semantic text styles for consistent typography across the app
 */
val SonetelMaterial3Typography = Typography(
    // Display styles
    displayLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSize3xl,
        lineHeight = (SonetelDesignTokens.fontSize3xl.value * 1.12f).sp,
        letterSpacing = (-0.25).sp
    ),
    displayMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSize2xl,
        lineHeight = (SonetelDesignTokens.fontSize2xl.value * 1.16f).sp,
        letterSpacing = 0.sp
    ),
    displaySmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSizeXl,
        lineHeight = (SonetelDesignTokens.fontSizeXl.value * 1.22f).sp,
        letterSpacing = 0.sp
    ),

    // Headline styles
    headlineLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = SonetelDesignTokens.fontSizeLg,
        lineHeight = (SonetelDesignTokens.fontSizeLg.value * 1.25f).sp,
        letterSpacing = 0.sp
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = SonetelDesignTokens.fontSizeMd,
        lineHeight = (SonetelDesignTokens.fontSizeMd.value * 1.25f).sp,
        letterSpacing = 0.sp
    ),
    headlineSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = SonetelDesignTokens.fontSizeSm,
        lineHeight = (SonetelDesignTokens.fontSizeSm.value * 1.33f).sp,
        letterSpacing = 0.sp
    ),

    // Title styles
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = SonetelDesignTokens.fontSizeLg,
        lineHeight = (SonetelDesignTokens.fontSizeLg.value * 1.28f).sp,
        letterSpacing = 0.sp
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = SonetelDesignTokens.fontSizeMd,
        lineHeight = (SonetelDesignTokens.fontSizeMd.value * 1.5f).sp,
        letterSpacing = 0.15.sp
    ),
    titleSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = SonetelDesignTokens.fontSizeSm,
        lineHeight = (SonetelDesignTokens.fontSizeSm.value * 1.43f).sp,
        letterSpacing = 0.1.sp
    ),

    // Body styles
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSizeMd,
        lineHeight = (SonetelDesignTokens.fontSizeMd.value * 1.5f).sp,
        letterSpacing = 0.5.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSizeSm,
        lineHeight = (SonetelDesignTokens.fontSizeSm.value * 1.43f).sp,
        letterSpacing = 0.25.sp
    ),
    bodySmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSizeXs,
        lineHeight = (SonetelDesignTokens.fontSizeXs.value * 1.33f).sp,
        letterSpacing = 0.4.sp
    ),

    // Label styles
    labelLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = SonetelDesignTokens.fontSizeSm,
        lineHeight = (SonetelDesignTokens.fontSizeSm.value * 1.43f).sp,
        letterSpacing = 0.1.sp
    ),
    labelMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = SonetelDesignTokens.fontSizeXs,
        lineHeight = (SonetelDesignTokens.fontSizeXs.value * 1.33f).sp,
        letterSpacing = 0.5.sp
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = SonetelDesignTokens.fontSizeXxs,
        lineHeight = (SonetelDesignTokens.fontSizeXxs.value * 1.45f).sp,
        letterSpacing = 0.5.sp
        )
)

/**
 * Complete Sonetel Typography with all Figma variations
 * Use these for exact design system compliance with Light/Regular/Prominent weights
 */
object SonetelTypography {

    // Display medium variants (64px, 64px line height, -2% letter spacing)
    object DisplayMedium {
        val light = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Light,
            fontSize = SonetelDesignTokens.fontSize5xl,  // 64sp
            lineHeight = SonetelDesignTokens.lineHeight64,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val regular = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSize5xl,  // 64sp
            lineHeight = SonetelDesignTokens.lineHeight64,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val prominent = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.SemiBold,
            fontSize = SonetelDesignTokens.fontSize5xl,  // 64sp
            lineHeight = SonetelDesignTokens.lineHeight64,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )
    }

    // Headline 3xl variants (40px, 46px line height, -2% letter spacing)
    object Headline3xl {
        val light = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSize4xl,  // 40sp
            lineHeight = SonetelDesignTokens.lineHeight46,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val regular = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.SemiBold,
            fontSize = SonetelDesignTokens.fontSize4xl,  // 40sp
            lineHeight = SonetelDesignTokens.lineHeight46,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val prominent = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Bold,
            fontSize = SonetelDesignTokens.fontSize4xl,  // 40sp
            lineHeight = SonetelDesignTokens.lineHeight46,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )
    }

    // Headline 2xl variants (34px, 40px line height, -2% letter spacing)
    object Headline2xl {
        val light = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSize3xl,  // 34sp
            lineHeight = SonetelDesignTokens.lineHeight40,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val regular = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.SemiBold,
            fontSize = SonetelDesignTokens.fontSize3xl,  // 34sp
            lineHeight = SonetelDesignTokens.lineHeight40,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val prominent = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Bold,
            fontSize = SonetelDesignTokens.fontSize3xl,  // 34sp
            lineHeight = SonetelDesignTokens.lineHeight40,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )
    }

    // Headline XL variants (28px, 32px line height, -2% letter spacing)
    object HeadlineXl {
        val light = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSize2xl,  // 28sp
            lineHeight = SonetelDesignTokens.lineHeight32,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val regular = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.SemiBold,
            fontSize = SonetelDesignTokens.fontSize2xl,  // 28sp
            lineHeight = SonetelDesignTokens.lineHeight32,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val prominent = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Bold,
            fontSize = SonetelDesignTokens.fontSize2xl,  // 28sp
            lineHeight = SonetelDesignTokens.lineHeight32,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )
    }

    // Headline large variants (24px, 29px line height, -2% letter spacing)
    object HeadlineLarge {
        val light = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSizeXl,  // 24sp
            lineHeight = SonetelDesignTokens.lineHeight29,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val regular = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.SemiBold,
            fontSize = SonetelDesignTokens.fontSizeXl,  // 24sp
            lineHeight = SonetelDesignTokens.lineHeight29,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val prominent = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Bold,
            fontSize = SonetelDesignTokens.fontSizeXl,  // 24sp
            lineHeight = SonetelDesignTokens.lineHeight29,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )
    }

    // Headline medium variants (20px, 24px line height, -2% letter spacing)
    object HeadlineMedium {
        val light = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSizeLg,  // 20sp
            lineHeight = SonetelDesignTokens.lineHeight24,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val regular = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.SemiBold,
            fontSize = SonetelDesignTokens.fontSizeLg,  // 20sp
            lineHeight = SonetelDesignTokens.lineHeight24,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val prominent = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Bold,
            fontSize = SonetelDesignTokens.fontSizeLg,  // 20sp
            lineHeight = SonetelDesignTokens.lineHeight24,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )
    }

    // Headline small variants (18px, 22px line height, -2% letter spacing)
    object HeadlineSmall {
        val light = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSizeBase,  // 18sp
            lineHeight = SonetelDesignTokens.lineHeight22,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val regular = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.SemiBold,
            fontSize = SonetelDesignTokens.fontSizeBase,  // 18sp
            lineHeight = SonetelDesignTokens.lineHeight22,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val prominent = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Bold,
            fontSize = SonetelDesignTokens.fontSizeBase,  // 18sp
            lineHeight = SonetelDesignTokens.lineHeight22,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )
    }

    // Label styles for buttons and UI elements
    object Label {
        val small = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSizeXxs,  // 11sp
            lineHeight = SonetelDesignTokens.lineHeight16,
            letterSpacing = 0.5.sp
        )

        val medium = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSizeXs,  // 12sp
            lineHeight = SonetelDesignTokens.lineHeight16,
            letterSpacing = 0.5.sp
        )

        val large = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSizeSm,  // 14sp
            lineHeight = SonetelDesignTokens.lineHeight20,
            letterSpacing = 0.1.sp
        )
    }

    // Body text styles
    object Body {
        val small = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Normal,
            fontSize = SonetelDesignTokens.fontSizeXs,  // 12sp
            lineHeight = SonetelDesignTokens.lineHeight16,
            letterSpacing = 0.4.sp
        )

        val medium = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Normal,
            fontSize = SonetelDesignTokens.fontSizeSm,  // 14sp
            lineHeight = SonetelDesignTokens.lineHeight20,
            letterSpacing = 0.25.sp
        )

        val large = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Normal,
            fontSize = SonetelDesignTokens.fontSizeMd,  // 16sp
            lineHeight = SonetelDesignTokens.lineHeight24,
            letterSpacing = 0.5.sp
        )
    }
}
`;

  fs.writeFileSync("./build/android/SonetelTypography.kt", kotlin);
}

function generateMaterial3Shapes(tokens) {
  let kotlin = `// Sonetel Material 3 Shapes
// Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually

package com.sonetel.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.ui.unit.dp
import com.sonetel.designsystem.SonetelDesignTokens

/**
 * Material 3 Shapes using Sonetel design tokens
 * Provides consistent corner shapes across the app
 */
val SonetelShapes = Shapes(
    extraSmall = RoundedCornerShape(SonetelDesignTokens.borderRadiusSmall),
    small = RoundedCornerShape(SonetelDesignTokens.borderRadiusSmall),
    medium = RoundedCornerShape(SonetelDesignTokens.borderRadiusMedium),
    large = RoundedCornerShape(SonetelDesignTokens.borderRadiusLarge),
    extraLarge = RoundedCornerShape(SonetelDesignTokens.borderRadiusLarge)
)
`;

  fs.writeFileSync("./build/android/SonetelShapes.kt", kotlin);
}

function generateMaterial3ThemeIntegration() {
  let kotlin = `// Sonetel Material 3 Theme Integration
// Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually

package com.sonetel.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable

/**
 * Complete Sonetel Material 3 theme
 * Use this composable to wrap your app content with consistent theming
 *
 * Usage:
 * SonetelTheme {
 *     // Your app content here
 * }
 */
@Composable
fun SonetelTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) {
        SonetelColorScheme.DarkColorScheme
    } else {
        SonetelColorScheme.LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = SonetelTypography,
        shapes = SonetelShapes,
        content = content
    )
}

/**
 * Use this for components that need to access design tokens directly
 * while still being wrapped in Material 3 theme
 */
@Composable
fun SonetelThemeWithTokens(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    SonetelTheme(darkTheme = darkTheme) {
        content()
    }
}
`;

  fs.writeFileSync("./build/android/SonetelTheme.kt", kotlin);
}

function generateAndroidComponents() {
  console.log("📱 Generating Android Jetpack Compose components...");

  // Create components directory
  const componentsDir = "./build/android/components";
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  // Generate Button component
  generateAndroidButton();

  console.log("✅ Android components generated");
}

function generateAndroidButton() {
  const kotlin = `// Sonetel Button Component - Jetpack Compose
// Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually

package com.sonetel.designsystem.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.tooling.preview.Preview
import com.sonetel.designsystem.SonetelDesignTokens
import com.sonetel.ui.theme.SonetelTypography

/**
 * Sonetel Button Component
 *
 * A Material 3 button that follows Sonetel design system specifications.
 * Supports multiple sizes, variants, and states with consistent styling.
 *
 * @param text The button label text
 * @param onClick Called when the button is clicked
 * @param modifier Modifier to be applied to the button
 * @param size The size variant of the button
 * @param variant The style variant of the button
 * @param isLoading Whether the button is in loading state
 * @param enabled Whether the button is enabled
 * @param interactionSource Optional interaction source for handling user interactions
 */
@Composable
fun SonetelButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    size: SonetelButtonSize = SonetelButtonSize.Medium,
    variant: SonetelButtonVariant = SonetelButtonVariant.Primary,
    isLoading: Boolean = false,
    enabled: Boolean = true,
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() }
) {
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed && enabled && !isLoading) 0.98f else 1f,
        label = "button_scale"
    )

    Button(
        onClick = onClick,
        modifier = modifier
            .scale(scale)
            .height(size.height)
            .let { mod ->
                size.minWidth?.let { minWidth ->
                    mod.widthIn(min = minWidth)
                } ?: mod
            },
        enabled = enabled && !isLoading,
        colors = ButtonDefaults.buttonColors(
            containerColor = variant.backgroundColor,
            contentColor = variant.textColor,
            disabledContainerColor = variant.backgroundColor.copy(alpha = 0.5f),
            disabledContentColor = variant.textColor.copy(alpha = 0.5f)
        ),
        border = variant.borderColor?.let { BorderStroke(2.dp, it) },
        shape = RoundedCornerShape(size.height / 2),
        contentPadding = PaddingValues(
            horizontal = size.horizontalPadding,
            vertical = size.verticalPadding
        ),
        interactionSource = interactionSource
    ) {
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.size(16.dp),
                color = variant.textColor,
                strokeWidth = 2.dp
            )
        } else {
                        Text(
                text = text,
                style = size.textStyle
            )
        }
    }
}

/**
 * Button size variants with design token values
 */
enum class SonetelButtonSize(
    val height: Dp,
    val horizontalPadding: Dp,
    val verticalPadding: Dp,
    val textStyle: TextStyle,
    val minWidth: Dp?
) {
                        ExtraSmall(
        height = SonetelDesignTokens.spacing4xl,
        horizontalPadding = SonetelDesignTokens.spacingM,
        verticalPadding = SonetelDesignTokens.spacingXs,
        textStyle = SonetelTypography.Label.small.copy(fontWeight = FontWeight.SemiBold),
        minWidth = null
    ),
    Small(
        height = SonetelDesignTokens.spacing10xl,
        horizontalPadding = SonetelDesignTokens.spacingL,
        verticalPadding = SonetelDesignTokens.spacingS,
        textStyle = SonetelTypography.Label.medium.copy(fontWeight = FontWeight.SemiBold),
        minWidth = null
    ),
    Medium(
        height = SonetelDesignTokens.spacing4xl + 4.dp,
        horizontalPadding = SonetelDesignTokens.spacingL,
        verticalPadding = SonetelDesignTokens.spacingS,
        textStyle = SonetelTypography.Label.medium.copy(fontWeight = FontWeight.SemiBold),
        minWidth = SonetelDesignTokens.spacing9xl
    ),
    Large(
        height = SonetelDesignTokens.spacing6xl,
        horizontalPadding = SonetelDesignTokens.spacingXl,
        verticalPadding = SonetelDesignTokens.spacingL,
        textStyle = SonetelTypography.Label.large.copy(fontWeight = FontWeight.SemiBold),
        minWidth = SonetelDesignTokens.spacing10xl
    ),
    ExtraLarge(
        height = SonetelDesignTokens.spacing7xl,
        horizontalPadding = SonetelDesignTokens.spacingXl,
        verticalPadding = SonetelDesignTokens.spacingL,
        textStyle = SonetelTypography.Label.large.copy(
            fontWeight = FontWeight.SemiBold,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        ),
        minWidth = 280.dp
    )
}

/**
 * Button style variants using design tokens
 */
enum class SonetelButtonVariant(
    val backgroundColor: Color,
    val textColor: Color,
    val borderColor: Color?
) {
    Primary(SonetelDesignTokens.solidZ7Light, SonetelDesignTokens.solidZ0Light, null),
    Secondary(SonetelDesignTokens.solidZ1Light, SonetelDesignTokens.solidZ7Light, null),
    Outline(Color.Transparent, SonetelDesignTokens.solidZ7Light, SonetelDesignTokens.solidZ7Light),
    Ghost(Color.Transparent, SonetelDesignTokens.solidZ7Light, null),
    Destructive(SonetelDesignTokens.alertCriticalLight, SonetelDesignTokens.solidZ0Light, null),
    Success(SonetelDesignTokens.accentsGreenLight, SonetelDesignTokens.solidZ0Light, null)
}

/**
 * Preview composables for development and testing
 */
@Preview(showBackground = true)
@Composable
internal fun SonetelButtonPreview() {
    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
                // Size variants
        SonetelButtonSize.entries.forEach { size ->
            SonetelButton(
                text = size.name,
                onClick = { },
                size = size
            )
        }

        // Style variants
        SonetelButtonVariant.entries.forEach { variant ->
            SonetelButton(
                text = variant.name,
                onClick = { },
                variant = variant
            )
        }
    }
}
`;

  fs.writeFileSync("./build/android/components/SonetelButton.kt", kotlin);
}

function generateIOSComponents() {
  console.log("📱 Generating iOS SwiftUI components...");

  // Create components directory
  const componentsDir = "./build/ios/components";
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  // Generate Button component
  generateIOSButton();

  console.log("✅ iOS components generated");
}

function generateIOSButton() {
  const swift = `// Sonetel Button Component - SwiftUI
// Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually

import SwiftUI

/**
 * Sonetel Button Component
 *
 * A SwiftUI button that follows Sonetel design system specifications.
 * Supports multiple sizes, variants, and states with consistent styling.
 */
public struct SonetelButton: View {
    let title: String
    let action: () -> Void

    var size: SonetelButtonSize = .medium
    var variant: SonetelButtonVariant = .primary
    var isLoading: Bool = false
    var isDisabled: Bool = false

    @State private var isPressed = false

    public init(
        title: String,
        action: @escaping () -> Void,
        size: SonetelButtonSize = .medium,
        variant: SonetelButtonVariant = .primary,
        isLoading: Bool = false,
        isDisabled: Bool = false
    ) {
        self.title = title
        self.action = action
        self.size = size
        self.variant = variant
        self.isLoading = isLoading
        self.isDisabled = isDisabled
    }

    public var body: some View {
        Button(action: action) {
            HStack {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: Color(variant.textColor)))
                        .scaleEffect(0.8)
                } else {
                    Text(title)
                                                .font(.system(size: size.fontSize, weight: .semibold))
                        .kerning(size == .extraLarge ? -0.36 : 0)
                        .foregroundColor(Color(variant.textColor))
                }
            }
            .frame(minWidth: size.minWidth, minHeight: size.height)
            .frame(height: size.height)
            .padding(.horizontal, size.horizontalPadding)
            .padding(.vertical, size.verticalPadding)
            .background(Color(variant.backgroundColor))
            .overlay(
                RoundedRectangle(cornerRadius: size.height / 2)
                    .stroke(
                        Color(variant.borderColor ?? .clear),
                        lineWidth: variant.borderColor != nil ? 2 : 0
                    )
            )
            .clipShape(RoundedRectangle(cornerRadius: size.height / 2))
        }
        .scaleEffect(isPressed ? 0.98 : 1.0)
        .animation(.easeOut(duration: 0.1), value: isPressed)
        .onLongPressGesture(minimumDuration: 0, maximumDistance: .infinity, pressing: { pressing in
            isPressed = pressing
        }, perform: {})
        .disabled(isDisabled || isLoading)
        .opacity(isDisabled ? 0.5 : 1.0)
    }
}

/**
 * Button size variants with design token values
 */
public enum SonetelButtonSize {
    case extraSmall, small, medium, large, extraLarge

        var height: CGFloat {
        switch self {
        case .extraSmall: return DesignSystemSpacing.spacing4xl
        case .small: return DesignSystemSpacing.spacing10xl
        case .medium: return DesignSystemSpacing.spacing4xl + 4
        case .large: return DesignSystemSpacing.spacing6xl
        case .extraLarge: return DesignSystemSpacing.spacing7xl
        }
    }

        var fontSize: CGFloat {
        switch self {
        case .extraSmall: return DesignSystemTypography.fontSizeLabelSmall
        case .small: return DesignSystemTypography.fontSizeLabelMedium
        case .medium: return DesignSystemTypography.fontSizeLabelMedium
        case .large: return DesignSystemTypography.fontSizeLabelLarge
        case .extraLarge: return DesignSystemTypography.fontSizeLabelXLarge
        }
    }

        var minWidth: CGFloat? {
        switch self {
        case .medium: return DesignSystemSpacing.spacing9xl
        case .large: return DesignSystemSpacing.spacing10xl
                case .extraLarge: return 280
        default: return nil
        }
    }

        var horizontalPadding: CGFloat {
        switch self {
        case .extraSmall: return DesignSystemSpacing.spacingM
        case .small: return DesignSystemSpacing.spacingL
        case .medium: return DesignSystemSpacing.spacingL
        case .large: return DesignSystemSpacing.spacingXl
        case .extraLarge: return DesignSystemSpacing.spacingXl
        }
    }

    var verticalPadding: CGFloat {
        switch self {
        case .extraSmall: return DesignSystemSpacing.spacingXs
        case .small: return DesignSystemSpacing.spacingS
        case .medium: return DesignSystemSpacing.spacingS
        case .large: return DesignSystemSpacing.spacingL
        case .extraLarge: return DesignSystemSpacing.spacingL
        }
    }
}

/**
 * Button style variants using design tokens
 */
public enum SonetelButtonVariant {
    case primary, secondary, outline, ghost, destructive, success

    var backgroundColor: UIColor {
        switch self {
        case .primary: return .solidZ7
        case .secondary: return .solidZ1
        case .outline: return .clear
        case .ghost: return .clear
        case .destructive: return .alertCritical
        case .success: return .accentsGreen
        }
    }

    var textColor: UIColor {
        switch self {
        case .primary: return .solidZ0
        case .secondary: return .solidZ7
        case .outline: return .solidZ7
        case .ghost: return .solidZ7
        case .destructive: return .solidZ0
        case .success: return .solidZ0
        }
    }

    var borderColor: UIColor? {
        switch self {
        case .outline: return .solidZ7
        default: return nil
        }
    }
}

/**
 * Preview for SwiftUI previews and development
 */
struct SonetelButton_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 16) {
            // Size variants
            ForEach([SonetelButtonSize.extraSmall, .small, .medium, .large, .extraLarge], id: \\.self) { size in
                SonetelButton(
                    title: "\\(size)",
                    action: { },
                    size: size
                )
            }

            // Style variants
            ForEach([SonetelButtonVariant.primary, .secondary, .outline, .ghost, .destructive, .success], id: \\.self) { variant in
                SonetelButton(
                    title: "\\(variant)",
                    action: { },
                    variant: variant
                )
            }
        }
        .padding()
    }
}
`;

  fs.writeFileSync("./build/ios/components/SonetelButton.swift", swift);
}

function generateComponentManifest() {
  const manifest = {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    components: {
      button: {
        version: "1.2.0", // Updated with Large button changes
        lastModified: new Date().toISOString(),
        files: {
          android: "components/SonetelButton.kt",
          ios: "components/SonetelButton.swift",
          documentation: "mobile-components/Button.md",
        },
        changes: [
          {
            version: "1.2.0",
            date: new Date().toISOString(),
            description:
              "Updated Large button: height 48px, min-width 80px, padding 20x16px to match Figma",
            breaking: false,
          },
          {
            version: "1.1.0",
            date: "2025-01-07",
            description:
              "Added design token integration for padding, font-size, and font-weight",
            breaking: false,
          },
          {
            version: "1.0.0",
            date: "2025-01-07",
            description:
              "Initial Button component with all size and style variants",
            breaking: false,
          },
        ],
      },
    },
    designTokens: {
      version: "1.0.0",
      files: {
        android: [
          "SonetelDesignTokens.kt",
          "SonetelColorScheme.kt",
          "SonetelTypography.kt",
          "SonetelShapes.kt",
          "SonetelTheme.kt",
        ],
        ios: [
          "DesignSystemColors.swift",
          "DesignSystemTypography.swift",
          "DesignSystemSpacing.swift",
        ],
      },
    },
    integration: {
      android: {
        minSdkVersion: 21,
        compileNeed:
          "androidx.compose.ui:ui, androidx.compose.material3:material3",
        importPath: "com.sonetel.designsystem.components.SonetelButton",
      },
      ios: {
        minIOSVersion: "14.0",
        framework: "SwiftUI",
        importPath: "import SonetelDesignSystem",
      },
    },
  };

  fs.writeFileSync(
    "./build/components.json",
    JSON.stringify(manifest, null, 2),
  );

  // Also generate a simple README for integration
  const readme = `# Sonetel Design System Components

## Installation

### Android (Jetpack Compose)
\`\`\`kotlin
// Add to your project and import:
import com.sonetel.designsystem.components.SonetelButton
import com.sonetel.designsystem.SonetelDesignTokens

// Usage:
SonetelButton(
    text = "Click me",
    onClick = { /* handle click */ },
    size = SonetelButtonSize.Large,
    variant = SonetelButtonVariant.Primary
)
\`\`\`

### iOS (SwiftUI)
\`\`\`swift
// Import and use:
import SonetelDesignSystem

// Usage:
SonetelButton(
    title: "Click me",
    action: { /* handle tap */ },
    size: .large,
    variant: .primary
)
\`\`\`

## Components

### Button v${manifest.components.button.version}
- **Android**: ${manifest.components.button.files.android}
- **iOS**: ${manifest.components.button.files.ios}
- **Last Updated**: ${new Date(manifest.components.button.lastModified).toLocaleDateString()}

#### Latest Changes:
${manifest.components.button.changes[0].description}

## Updating Components

1. **Submodule Approach**: Add this repo as a submodule and pull changes
2. **CI/CD Integration**: Set up automated checks for component updates
3. **Version Tracking**: Check \`components.json\` for version changes

Generated on: ${new Date().toLocaleDateString()}
`;

  fs.writeFileSync("./build/README.md", readme);
}

function generateMobileComponentSpecs() {
  console.log("📱 Copying mobile component specifications...");

  // Create mobile-components directory in build
  const mobileComponentsDir = "./build/mobile-components";
  if (!fs.existsSync(mobileComponentsDir)) {
    fs.mkdirSync(mobileComponentsDir, { recursive: true });
  }

  // Copy component specifications
  const sourceDir = "./mobile-components";
  if (fs.existsSync(sourceDir)) {
    const files = fs.readdirSync(sourceDir);
    files.forEach((file) => {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(mobileComponentsDir, file);
      fs.copyFileSync(sourcePath, destPath);
      console.log(`   ✅ ${file}`);
    });
  }

  console.log("✅ Mobile component specifications exported");
}

function generateStats(tokens) {
  const stats = {
    colors: tokens.lightColors.length,
    typography: tokens.typography.length,
    spacing: tokens.spacing.length,
    borderRadius: tokens.borderRadius.length,
    totalTokens: tokens.totalTokens,
    lastUpdated: new Date().toISOString(),
    platforms: {
      ios: {
        files: [
          "DesignSystemColors.swift",
          "DesignSystemTypography.swift",
          "DesignSystemSpacing.swift",
        ],
        components: ["mobile-components/Button.md"],
      },
      android: {
        files: [
          "values/design_colors.xml",
          "values/design_dimens.xml",
          "values-night/design_colors.xml",
          "SonetelDesignTokens.kt",
          "SonetelColorScheme.kt",
        ],
        components: ["mobile-components/Button.md"],
      },
    },
  };

  fs.writeFileSync("./build/ios/stats.json", JSON.stringify(stats, null, 2));
  fs.writeFileSync(
    "./build/android/stats.json",
    JSON.stringify(stats, null, 2),
  );
  fs.writeFileSync("./build/stats.json", JSON.stringify(stats, null, 2));
}

// Utility functions
function toSwiftName(name) {
  return name
    .split(/[.\s-]/)
    .map((part, index) =>
      index === 0
        ? part.toLowerCase()
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    )
    .join("");
}

function toAndroidName(name) {
  return name.toLowerCase().replace(/[.\s-]/g, "_");
}

function toKotlinName(name) {
  return name
    .split(/[.\s-]/)
    .map((part, index) =>
      index === 0
        ? part.toLowerCase()
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    )
    .join("");
}

function hexToRGB(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return {
    r: r.toFixed(3),
    g: g.toFixed(3),
    b: b.toFixed(3),
  };
}
