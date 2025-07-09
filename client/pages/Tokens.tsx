import { useState, useEffect } from "react";
import { Search, Palette, Type, Ruler, Download } from "lucide-react";

interface Token {
  name: string;
  value: string;
  type: string;
  category: string;
  mode?: string;
  rawValue?: string;
}

export default function Tokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [colorMode, setColorMode] = useState("Light");

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    const mobileTokens: Token[] = [];
    const referenceMap = new Map<string, string>();

    try {
      // Step 1: Load Core tokens ONLY for reference resolution (don't add to UI)
      console.log("Loading Core tokens for reference resolution...");

      const coreColorResponse = await fetch("/tokens/Core/Colors/Mode 1.json");
      if (coreColorResponse.ok) {
        const coreColors = await coreColorResponse.json();
        buildReferenceMap(coreColors, referenceMap, "");
      }

      try {
        const coreTypographyResponse = await fetch(
          "/tokens/Core/Typography/Value.json",
        );
        if (coreTypographyResponse.ok) {
          const coreTypography = await coreTypographyResponse.json();
          buildReferenceMap(coreTypography, referenceMap, "");
        }
      } catch (e) {
        console.log("Core Typography not found, skipping");
      }

      try {
        const coreSpacingResponse = await fetch(
          "/tokens/Core/Spacings/Mode 1.json",
        );
        if (coreSpacingResponse.ok) {
          const coreSpacing = await coreSpacingResponse.json();
          buildReferenceMap(coreSpacing, referenceMap, "");
        }
      } catch (e) {
        console.log("Core Spacing not found, skipping");
      }

      console.log(`Built reference map with ${referenceMap.size} references`);

      // Step 2: Load ONLY mobile (Sys) tokens for display
      console.log("Loading mobile tokens...");

      // Load Sys Color Light mode
      const sysColorLightResponse = await fetch("/tokens/Sys/Color/Light.json");
      if (sysColorLightResponse.ok) {
        const sysColorLight = await sysColorLightResponse.json();
        parseTokens(
          sysColorLight,
          mobileTokens,
          "Color",
          "Light",
          referenceMap,
        );
      }

      // Load Sys Color Dark mode
      try {
        const sysColorDarkResponse = await fetch("/tokens/Sys/Color/Dark.json");
        if (sysColorDarkResponse.ok) {
          const sysColorDark = await sysColorDarkResponse.json();
          parseTokens(
            sysColorDark,
            mobileTokens,
            "Color",
            "Dark",
            referenceMap,
          );
          console.log("Successfully loaded Dark mode colors");
        } else {
          console.warn("Dark mode colors file not found or not accessible");
        }
      } catch (e) {
        console.error("Failed to load Dark mode colors:", e);
      }

      // Load Sys Typography tokens (no mode)
      const sysTypographyResponse = await fetch("/tokens/Sys/Typography.json");
      if (sysTypographyResponse.ok) {
        const sysTypography = await sysTypographyResponse.json();
        parseTokens(
          sysTypography,
          mobileTokens,
          "Typography",
          null,
          referenceMap,
        );
      }

      // Load Sys Spacing tokens (no mode)
      const sysSpacingResponse = await fetch("/tokens/Sys/Spacing.json");
      if (sysSpacingResponse.ok) {
        const sysSpacing = await sysSpacingResponse.json();
        parseTokens(sysSpacing, mobileTokens, "Spacing", null, referenceMap);
      }

      // Load Sys Border Radius tokens (no mode)
      const sysBorderResponse = await fetch("/tokens/Sys/Border Radius.json");
      if (sysBorderResponse.ok) {
        const sysBorder = await sysBorderResponse.json();
        parseTokens(
          sysBorder,
          mobileTokens,
          "Border Radius",
          null,
          referenceMap,
        );
      }

      console.log(`Loaded ${mobileTokens.length} mobile tokens`);
      setTokens(mobileTokens);

      // Auto-set to Dark mode if it's available and Light mode isn't
      const hasLightMode = mobileTokens.some(
        (token) => token.type === "Color" && token.mode === "Light",
      );
      const hasDarkMode = mobileTokens.some(
        (token) => token.type === "Color" && token.mode === "Dark",
      );

      if (hasDarkMode && !hasLightMode) {
        setColorMode("Dark");
      } else if (hasDarkMode && hasLightMode) {
        // Both modes available, keep Light as default
        setColorMode("Light");
      }
    } catch (error) {
      console.error("Failed to load tokens:", error);
    } finally {
      setLoading(false);
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
          // This is a token - add to reference map
          const token = value as any;
          referenceMap.set(fullKey, String(token.value));
        } else {
          // This is a nested object
          buildReferenceMap(value, referenceMap, fullKey);
        }
      }
    }
  };

  const resolveTokenValue = (
    value: string,
    referenceMap: Map<string, string>,
  ): string => {
    // Handle Token Studio references like {Neutral.Solid.96W}
    if (
      typeof value === "string" &&
      value.startsWith("{") &&
      value.endsWith("}")
    ) {
      const reference = value.slice(1, -1); // Remove { and }
      const resolvedValue = referenceMap.get(reference);

      if (resolvedValue) {
        // Check if the resolved value is also a reference (recursive resolution)
        if (resolvedValue.startsWith("{") && resolvedValue.endsWith("}")) {
          return resolveTokenValue(resolvedValue, referenceMap);
        }
        return resolvedValue;
      } else {
        console.warn(`Could not resolve reference: ${reference}`);
        return value; // Return original if can't resolve
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
          // This is a token
          const token = value as any;
          const rawValue = String(token.value);
          const resolvedValue = resolveTokenValue(rawValue, referenceMap);

          tokens.push({
            name: fullKey,
            value: resolvedValue,
            type: type,
            category: mode ? `${type} (${mode})` : type,
            mode: mode,
            rawValue: rawValue,
          });
        } else {
          // This is a nested object
          parseTokens(value, tokens, type, mode, referenceMap, fullKey);
        }
      }
    }
  };

  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.value.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || token.type === selectedType;
    return matchesSearch && matchesType;
  });

  const tokenTypes = ["all", ...new Set(tokens.map((t) => t.type))];

  // Separate color tokens by mode and other tokens without mode
  const colorTokens = filteredTokens.filter((token) => token.type === "Color");
  const nonColorTokens = filteredTokens.filter(
    (token) => token.type !== "Color",
  );

  // Group non-color tokens by type only
  const groupedNonColorTokens = nonColorTokens.reduce(
    (groups, token) => {
      if (!groups[token.type]) {
        groups[token.type] = {
          type: token.type,
          tokens: [],
        };
      }
      groups[token.type].tokens.push(token);
      return groups;
    },
    {} as Record<string, { type: string; tokens: Token[] }>,
  );

  // Group color tokens by mode
  const groupedColorTokens = colorTokens.reduce(
    (groups, token) => {
      const mode = token.mode || "Light";
      if (!groups[mode]) {
        groups[mode] = {
          mode: mode,
          tokens: [],
        };
      }
      groups[mode].tokens.push(token);
      return groups;
    },
    {} as Record<string, { mode: string; tokens: Token[] }>,
  );

  const getTokenIcon = (type: string) => {
    if (type === "color") return <Palette className="w-4 h-4" />;
    if (type === "text" || type === "number")
      return <Type className="w-4 h-4" />;
    return <Ruler className="w-4 h-4" />;
  };

  const renderTokenValue = (token: Token) => {
    if (token.type === "Color") {
      // Handle hex colors
      if (token.value.startsWith("#")) {
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: token.value }}
              title={token.value}
            />
            <div className="flex flex-col">
              <span className="font-mono text-sm font-medium text-gray-900">
                {token.value.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">Hex Color</span>
            </div>
          </div>
        );
      }
      // Handle RGB colors
      if (token.value.startsWith("rgb")) {
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: token.value }}
              title={token.value}
            />
            <div className="flex flex-col">
              <span className="font-mono text-sm font-medium text-gray-900">
                {token.value}
              </span>
              <span className="text-xs text-gray-500">RGB Color</span>
            </div>
          </div>
        );
      }
      // Handle other color formats
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
            <span className="text-xs text-gray-500">?</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-medium text-gray-900">
              {token.value}
            </span>
            <span className="text-xs text-gray-500">Color Value</span>
          </div>
        </div>
      );
    }

    // Handle Typography tokens
    if (token.type === "Typography") {
      return (
        <div className="flex flex-col">
          <span className="font-mono text-sm font-medium text-gray-900">
            {token.value}
          </span>
          <span className="text-xs text-gray-500">
            {token.name.includes("size")
              ? "Font Size"
              : token.name.includes("weight")
                ? "Font Weight"
                : "Typography"}
          </span>
        </div>
      );
    }

    // Handle Spacing tokens
    if (token.type === "Spacing") {
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border-2 border-blue-200 bg-blue-50 flex items-center justify-center">
            <div
              className="bg-blue-400 rounded"
              style={{
                width: Math.min(parseInt(token.value) / 2, 16) + "px",
                height: Math.min(parseInt(token.value) / 2, 16) + "px",
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-medium text-gray-900">
              {token.value}
            </span>
            <span className="text-xs text-gray-500">Spacing</span>
          </div>
        </div>
      );
    }

    // Handle Border Radius tokens
    if (token.type === "Border Radius") {
      return (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 border-2 border-purple-200 bg-purple-50"
            style={{ borderRadius: Math.min(parseInt(token.value), 8) + "px" }}
          />
          <div className="flex flex-col">
            <span className="font-mono text-sm font-medium text-gray-900">
              {token.value}
            </span>
            <span className="text-xs text-gray-500">Border Radius</span>
          </div>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="flex flex-col">
        <span className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">
          {token.value}
        </span>
        <span className="text-xs text-gray-500 mt-1">{token.type}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading tokens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Mobile Design Tokens
          </h1>
          <p className="text-gray-600 mt-1">
            {tokens.length} mobile tokens for iOS and Android apps
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search mobile tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {tokenTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All Types" : type}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredTokens.length} of {tokens.length} tokens
          </p>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export Tokens
          </button>
        </div>

        {/* Token Groups */}
        {Object.keys(groupedColorTokens).length === 0 &&
        Object.keys(groupedNonColorTokens).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No mobile tokens found matching your criteria
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Color Tokens with Tabs */}
            {(selectedType === "all" || selectedType === "Color") &&
              Object.keys(groupedColorTokens).length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    {getTokenIcon("Color")}
                    <h2 className="text-xl font-bold text-gray-900">Color</h2>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {Object.values(groupedColorTokens).reduce(
                        (sum, group) => sum + group.tokens.length,
                        0,
                      )}{" "}
                      tokens
                    </span>
                  </div>

                  {/* Color Mode Tabs */}
                  <div className="flex gap-2 mb-6">
                    {Object.keys(groupedColorTokens).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setColorMode(mode)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          colorMode === mode
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {mode} Mode
                        <span className="ml-2 text-xs opacity-75">
                          ({groupedColorTokens[mode].tokens.length})
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Color Tokens for Selected Mode */}
                  {groupedColorTokens[colorMode] && (
                    <div className="grid gap-4">
                      {groupedColorTokens[colorMode].tokens.map(
                        (token, tokenIndex) => (
                          <div
                            key={tokenIndex}
                            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                  {token.name}
                                </h3>
                                <div className="flex items-center gap-4">
                                  <div>{renderTokenValue(token)}</div>
                                  {token.rawValue &&
                                    token.rawValue !== token.value && (
                                      <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                                        Reference: {token.rawValue}
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}

            {/* Non-Color Token Groups */}
            {Object.values(groupedNonColorTokens).map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  {getTokenIcon(group.type)}
                  <h2 className="text-xl font-bold text-gray-900">
                    {group.type}
                  </h2>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {group.tokens.length} tokens
                  </span>
                </div>

                <div className="grid gap-4">
                  {group.tokens.map((token, tokenIndex) => (
                    <div
                      key={tokenIndex}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {token.name}
                          </h3>
                          <div className="flex items-center gap-4">
                            <div>{renderTokenValue(token)}</div>
                            {token.rawValue &&
                              token.rawValue !== token.value && (
                                <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                                  Reference: {token.rawValue}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
