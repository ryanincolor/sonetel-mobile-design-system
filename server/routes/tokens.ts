import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

interface TokenStats {
  total: number;
  colors: number;
  typography: number;
  spacing: number;
  borderRadius: number;
  lastUpdated?: string;
}

interface Token {
  name: string;
  value: string;
  type: string;
  category: string;
  mode?: string;
  originalValue?: string;
}

export const handleTokenStats: RequestHandler = (req, res) => {
  try {
    // Calculate stats directly from source token files
    let colorCount = 0;
    let typographyCount = 0;
    let spacingCount = 0;
    let borderRadiusCount = 0;
    let lastUpdated: string | undefined;

    // Count tokens from source files
    const countTokensInFile = (filePath: string): number => {
      if (!fs.existsSync(filePath)) return 0;
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return countTokensInObject(data);
    };

    const countTokensInObject = (obj: any): number => {
      let count = 0;
      for (const [key, value] of Object.entries(obj)) {
        if (
          value &&
          typeof value === "object" &&
          "value" in value &&
          "type" in value
        ) {
          count++;
        } else if (value && typeof value === "object") {
          count += countTokensInObject(value);
        }
      }
      return count;
    };

    // Count colors (count both light and dark to match build script)
    const lightColorCount = countTokensInFile("./tokens/Sys/Color/Light.json");
    const darkColorCount = countTokensInFile("./tokens/Sys/Color/Dark.json");
    colorCount = lightColorCount + darkColorCount;

    // Count other token types
    typographyCount = countTokensInFile("./tokens/Sys/Typography.json");
    spacingCount = countTokensInFile("./tokens/Sys/Spacing.json");
    borderRadiusCount = countTokensInFile("./tokens/Sys/Border Radius.json");

    // Try to get last updated from any generated stats file
    const checkLastUpdated = (filePath: string) => {
      if (fs.existsSync(filePath)) {
        try {
          const stats = JSON.parse(fs.readFileSync(filePath, "utf8"));
          return stats.lastUpdated;
        } catch (e) {
          return undefined;
        }
      }
      return undefined;
    };

    lastUpdated =
      checkLastUpdated("./dist/ios/stats.json") ||
      checkLastUpdated("./dist/android/stats.json");

    const stats: TokenStats = {
      total: colorCount + typographyCount + spacingCount + borderRadiusCount,
      colors: colorCount,
      typography: typographyCount,
      spacing: spacingCount,
      borderRadius: borderRadiusCount,
      lastUpdated,
    };

    res.json(stats);
  } catch (error) {
    console.error("Failed to load token stats:", error);
    res.status(500).json({ error: "Failed to load token stats" });
  }
};

export const handleTokenList: RequestHandler = (req, res) => {
  try {
    const tokens: Token[] = [];

    // Load system tokens
    const loadTokensFromFile = (
      filePath: string,
      type: string,
      mode?: string,
    ) => {
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        extractTokens(data, tokens, type, mode);
      }
    };

    // Build reference map for resolution
    const refs = new Map<string, string>();
    const buildReferenceMap = (filePath: string, prefix = "") => {
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        mapRefs(data, refs, prefix);
      }
    };

    // Build reference map from core tokens
    buildReferenceMap("./tokens/Core/Typography.json");
    buildReferenceMap("./tokens/Core/Spacings.json", "spacing");
    buildReferenceMap("./tokens/Core/Colors.json");
    buildReferenceMap("./tokens/Core/Icons.json");

    // Load system tokens
    loadTokensFromFile("./tokens/Sys/Color/Light.json", "color", "Light");
    loadTokensFromFile("./tokens/Sys/Color/Dark.json", "color", "Dark");
    loadTokensFromFile("./tokens/Sys/Typography.json", "typography");
    loadTokensFromFile("./tokens/Sys/Spacing.json", "spacing");
    loadTokensFromFile("./tokens/Sys/Border Radius.json", "borderRadius");

    // Resolve references in tokens
    tokens.forEach((token) => {
      if (
        token.originalValue &&
        typeof token.originalValue === "string" &&
        token.originalValue.startsWith("{") &&
        token.originalValue.endsWith("}")
      ) {
        const ref = token.originalValue.slice(1, -1);
        const resolved = refs.get(ref);
        if (resolved) {
          token.value = resolved;
        }
      }
    });

    res.json(tokens);
  } catch (error) {
    console.error("Failed to load tokens:", error);
    res.status(500).json({ error: "Failed to load tokens" });
  }
};

function mapRefs(obj: any, refs: Map<string, string>, prefix = "") {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && "value" in value) {
      refs.set(fullKey, String(value.value));
    } else if (value && typeof value === "object") {
      mapRefs(value, refs, fullKey);
    }
  }
}

function extractTokens(
  obj: any,
  tokens: Token[],
  type: string,
  mode?: string,
  prefix = "",
) {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (
      value &&
      typeof value === "object" &&
      "value" in value &&
      "type" in value
    ) {
      const token = value as any;
      tokens.push({
        name: fullKey,
        value: token.value,
        type: type,
        category: mode ? `${type} (${mode})` : type,
        mode: mode,
        originalValue: token.value,
      });
    } else if (value && typeof value === "object") {
      extractTokens(value, tokens, type, mode, fullKey);
    }
  }
}
