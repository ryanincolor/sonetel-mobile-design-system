import { useState, useEffect } from "react";
import { Download, Copy, Check, Code, Palette } from "lucide-react";

interface Token {
  name: string;
  value: string;
  type: string;
  mode?: string;
  rawValue?: string;
}

export default function Export() {
  const [selectedPlatform, setSelectedPlatform] = useState<"ios" | "android">(
    "ios",
  );
  const [selectedFormat, setSelectedFormat] = useState<
    "swift" | "kotlin" | "xml"
  >("swift");
  const [selectedMode, setSelectedMode] = useState<"Light" | "Dark">("Light");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    const allTokens: Token[] = [];
    const referenceMap = new Map<string, string>();

    try {
      // Load Core tokens for reference resolution
      const coreColorResponse = await fetch("/tokens/Core/Colors/Mode 1.json");
      if (coreColorResponse.ok) {
        const coreColors = await coreColorResponse.json();
        buildReferenceMap(coreColors, referenceMap, "");
      }

      // Load Sys Color Light mode
      const sysColorLightResponse = await fetch("/tokens/Sys/Color/Light.json");
      if (sysColorLightResponse.ok) {
        const sysColorLight = await sysColorLightResponse.json();
        parseTokens(sysColorLight, allTokens, "Color", "Light", referenceMap);
      }

      // Load Sys Color Dark mode
      try {
        const sysColorDarkResponse = await fetch("/tokens/Sys/Color/Dark.json");
        if (sysColorDarkResponse.ok) {
          const sysColorDark = await sysColorDarkResponse.json();
          parseTokens(sysColorDark, allTokens, "Color", "Dark", referenceMap);
        }
      } catch (e) {
        console.log("Dark mode colors not found");
      }

      // Load other token types
      const sysTypographyResponse = await fetch("/tokens/Sys/Typography.json");
      if (sysTypographyResponse.ok) {
        const sysTypography = await sysTypographyResponse.json();
        parseTokens(sysTypography, allTokens, "Typography", null, referenceMap);
      }

      const sysSpacingResponse = await fetch("/tokens/Sys/Spacing.json");
      if (sysSpacingResponse.ok) {
        const sysSpacing = await sysSpacingResponse.json();
        parseTokens(sysSpacing, allTokens, "Spacing", null, referenceMap);
      }

      setTokens(allTokens);
    } catch (error) {
      console.error("Failed to load tokens:", error);
    }
  };

  const buildReferenceMap = (
    obj: any,
    referenceMap: Map<string, string>,
    prefix: string,
  ) => {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object") {
        if ("value" in value && "type" in value) {
          const token = value as any;
          referenceMap.set(fullKey, String(token.value));
        } else {
          buildReferenceMap(value, referenceMap, fullKey);
        }
      }
    }
  };

  const resolveTokenValue = (
    value: string,
    referenceMap: Map<string, string>,
  ): string => {
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
  };

  const parseTokens = (
    obj: any,
    tokens: Token[],
    type: string,
    mode: string | null,
    referenceMap: Map<string, string>,
    prefix = "",
  ) => {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object") {
        if ("value" in value && "type" in value) {
          const token = value as any;
          const rawValue = String(token.value);
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
  };

  const convertHexToUIColor = (hex: string): string => {
    if (!hex.startsWith("#") || hex.length !== 7)
      return `UIColor(named: "${hex}")`;

    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    return `UIColor(red: ${r.toFixed(3)}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)}, alpha: 1.0)`;
  };

  const generateSwiftVariableName = (name: string): string => {
    return name
      .split(".")
      .map((part, index) => {
        if (index === 0) return part.toLowerCase();
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join("")
      .replace(/[^a-zA-Z0-9]/g, "");
  };

  const generateCode = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let code = "";

    if (selectedPlatform === "ios" && selectedFormat === "swift") {
      const colorTokens = tokens.filter(
        (t) => t.type === "Color" && t.mode === selectedMode,
      );
      const typographyTokens = tokens.filter((t) => t.type === "Typography");
      const spacingTokens = tokens.filter((t) => t.type === "Spacing");

      code = `// ${selectedMode} Mode Design Tokens - Generated from Design System
// Auto-generated on ${new Date().toLocaleDateString()} - Do not edit manually

import UIKit

extension UIColor {

    // MARK: - ${selectedMode} Mode Colors

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

      if (typographyTokens.length > 0) {
        code += `}

extension UIFont {

    // MARK: - Typography

`;

        const fontSizes = typographyTokens.filter((t) =>
          t.name.includes("font-size"),
        );
        fontSizes.forEach((token) => {
          const varName = generateSwiftVariableName(token.name);
          const size = parseFloat(token.value);
          code += `    static let ${varName}Size: CGFloat = ${size}

`;
        });
      }

      if (spacingTokens.length > 0) {
        code += `}

struct DesignSystemSpacing {

    // MARK: - Spacing Values

`;

        spacingTokens.forEach((token) => {
          const varName = generateSwiftVariableName(token.name);
          const spacing = parseFloat(token.value);
          code += `    static let ${varName}: CGFloat = ${spacing}

`;
        });
      }

      code += `}

// MARK: - Usage Example
/*
// Set background color
view.backgroundColor = .solidZ0

// Set text color
label.textColor = .onSurfacePrimary

// Set spacing
stackView.spacing = DesignSystemSpacing.spacingMd
*/`;
    } else if (selectedPlatform === "android" && selectedFormat === "kotlin") {
      code = `// Android Design Tokens - Generated from Token Studio
package com.yourapp.designsystem

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

object DesignSystemColors {
    // System Colors
    val solidZ0 = Color.White
    val solidZ1 = Color(0xFFE5E5E5)
    val solidZ2 = Color(0xFFD9D9D9)

    // On-Surface Colors
    val onSurfacePrimary = Color.Black
    val onSurfaceSecondary = Color.Gray
}

object DesignSystemTypography {
    // Headlines
    val headlineH1 = TextStyle(
        fontSize = 40.sp,
        fontWeight = FontWeight.Bold
    )
    val headlineH2 = TextStyle(
        fontSize = 34.sp,
        fontWeight = FontWeight.Bold
    )
    val headlineH3 = TextStyle(
        fontSize = 28.sp,
        fontWeight = FontWeight.SemiBold
    )

    // Body
    val bodyRegular = TextStyle(
        fontSize = 16.sp,
        fontWeight = FontWeight.Normal
    )
    val bodyProminent = TextStyle(
        fontSize = 16.sp,
        fontWeight = FontWeight.Medium
    )
}

object DesignSystemSpacing {
    val xs = 4.dp
    val sm = 8.dp
    val md = 16.dp
    val lg = 24.dp
    val xl = 32.dp
}`;
    } else if (selectedPlatform === "android" && selectedFormat === "xml") {
      code = `<?xml version="1.0" encoding="utf-8"?>
<!-- Android Design Tokens - Generated from Token Studio -->
<resources>
    <!-- Colors -->
    <color name="solid_z0">#FFFFFF</color>
    <color name="solid_z1">#E5E5E5</color>
    <color name="solid_z2">#D9D9D9</color>
    <color name="on_surface_primary">#000000</color>
    <color name="on_surface_secondary">#808080</color>

    <!-- Text Sizes -->
    <dimen name="headline_h1">40sp</dimen>
    <dimen name="headline_h2">34sp</dimen>
    <dimen name="headline_h3">28sp</dimen>
    <dimen name="body_regular">16sp</dimen>
    <dimen name="body_prominent">16sp</dimen>

    <!-- Spacing -->
    <dimen name="spacing_xs">4dp</dimen>
    <dimen name="spacing_sm">8dp</dimen>
    <dimen name="spacing_md">16dp</dimen>
    <dimen name="spacing_lg">24dp</dimen>
    <dimen name="spacing_xl">32dp</dimen>
</resources>`;
    }

    setGeneratedCode(code);
    setIsGenerating(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadFile = () => {
    const extension =
      selectedFormat === "swift"
        ? "swift"
        : selectedFormat === "kotlin"
          ? "kt"
          : "xml";

    let filename = "design-tokens";
    if (selectedPlatform === "ios") {
      filename = `DesignSystem${selectedMode}Colors`;
    }
    filename += `.${extension}`;

    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Export Tokens</h1>
          <p className="text-gray-600 mt-1">
            Generate platform-specific code from your design tokens
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Export Configuration
              </h2>

              {/* Platform Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Platform
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="ios"
                      checked={selectedPlatform === "ios"}
                      onChange={(e) => {
                        setSelectedPlatform(e.target.value as "ios");
                        setSelectedFormat("swift");
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-2xl">🍎</span>
                    <span className="text-sm font-medium text-gray-900">
                      iOS
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="android"
                      checked={selectedPlatform === "android"}
                      onChange={(e) => {
                        setSelectedPlatform(e.target.value as "android");
                        setSelectedFormat("kotlin");
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-2xl">🤖</span>
                    <span className="text-sm font-medium text-gray-900">
                      Android
                    </span>
                  </label>
                </div>
              </div>

              {/* Format Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Format
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {selectedPlatform === "ios" && (
                    <option value="swift">Swift</option>
                  )}
                  {selectedPlatform === "android" && (
                    <>
                      <option value="kotlin">Kotlin</option>
                      <option value="xml">XML Resources</option>
                    </>
                  )}
                </select>
              </div>

              {/* Color Mode Selection for iOS */}
              {selectedPlatform === "ios" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Color Mode
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="Light"
                        checked={selectedMode === "Light"}
                        onChange={(e) =>
                          setSelectedMode(e.target.value as "Light")
                        }
                        className="w-4 h-4 text-blue-600"
                      />
                      <Palette className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Light Mode Colors
                      </span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="Dark"
                        checked={selectedMode === "Dark"}
                        onChange={(e) =>
                          setSelectedMode(e.target.value as "Dark")
                        }
                        className="w-4 h-4 text-blue-600"
                      />
                      <Palette className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Dark Mode Colors
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={generateCode}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4" />
                    Generate Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Code */}
          <div className="lg:col-span-2">
            {!generatedCode ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Code className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Generate
                </h3>
                <p className="text-gray-600">
                  Select your platform and format, then click "Generate Code"
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {selectedPlatform === "ios"
                        ? `DesignSystem${selectedMode}Colors`
                        : "design-tokens"}
                      .
                      {selectedFormat === "swift"
                        ? "swift"
                        : selectedFormat === "kotlin"
                          ? "kt"
                          : "xml"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedPlatform.toUpperCase()} •{" "}
                      {selectedFormat.toUpperCase()}
                      {selectedPlatform === "ios" && ` • ${selectedMode} Mode`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={downloadFile}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                      title="Download file"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <pre className="text-sm bg-gray-50 rounded-lg p-4 overflow-x-auto">
                    <code className="text-gray-800">{generatedCode}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
