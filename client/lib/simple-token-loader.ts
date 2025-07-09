import { DesignToken } from "@shared/design-tokens";

export class SimpleTokenLoader {
  static async loadSysTokens(): Promise<DesignToken[]> {
    const tokens: DesignToken[] = [];

    try {
      // Load Core tokens first for reference resolution
      const coreColorsResponse = await fetch("/tokens/Core/Colors/Mode 1.json");
      const coreColors = await coreColorsResponse.json();

      // Load Sys color tokens
      const sysColorLightResponse = await fetch("/tokens/Sys/Color/Light.json");
      const sysColorLight = await sysColorLightResponse.json();

      // Load Sys typography tokens
      const sysTypographyResponse = await fetch("/tokens/Sys/Typography.json");
      const sysTypography = await sysTypographyResponse.json();

      // Load Sys spacing tokens
      const sysSpacingResponse = await fetch("/tokens/Sys/Spacing.json");
      const sysSpacing = await sysSpacingResponse.json();

      // Load Sys border radius tokens
      const sysBorderRadiusResponse = await fetch(
        "/tokens/Sys/Border Radius.json",
      );
      const sysBorderRadius = await sysBorderRadiusResponse.json();

      console.log("Loaded token files successfully");

      // Create a reference map from core tokens
      const referenceMap = new Map<string, string>();
      this.buildReferenceMap(coreColors, referenceMap, "");

      // Parse Sys color tokens
      this.parseTokens(sysColorLight, tokens, "sys.color", referenceMap);

      // Parse Sys typography tokens
      this.parseTokens(sysTypography, tokens, "sys.typography", referenceMap);

      // Parse Sys spacing tokens
      this.parseTokens(sysSpacing, tokens, "sys.spacing", referenceMap);

      // Parse Sys border radius tokens
      this.parseTokens(
        sysBorderRadius,
        tokens,
        "sys.border-radius",
        referenceMap,
      );

      console.log(`Loaded ${tokens.length} Sys tokens`);
      return tokens;
    } catch (error) {
      console.error("Failed to load Sys tokens:", error);
      return [];
    }
  }

  private static buildReferenceMap(
    obj: any,
    map: Map<string, string>,
    prefix: string,
  ) {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (value && typeof value === "object") {
        if ("value" in value && "type" in value) {
          // This is a token
          map.set(fullKey, (value as any).value);
        } else {
          // This is a nested object
          this.buildReferenceMap(value, map, fullKey);
        }
      }
    }
  }

  private static parseTokens(
    obj: any,
    tokens: DesignToken[],
    category: string,
    referenceMap: Map<string, string>,
    prefix = "",
  ) {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (value && typeof value === "object") {
        if ("value" in value && "type" in value) {
          // This is a token
          const token = value as any;
          let resolvedValue = token.value;

          // Resolve references
          if (
            typeof token.value === "string" &&
            token.value.startsWith("{") &&
            token.value.endsWith("}")
          ) {
            const reference = token.value.slice(1, -1);
            const resolved = referenceMap.get(reference);
            if (resolved) {
              resolvedValue = resolved;
            } else {
              console.warn(`Could not resolve reference: ${reference}`);
            }
          }

          tokens.push({
            name: fullKey,
            value: String(resolvedValue),
            type: this.mapTokenType(token.type, fullKey),
            category: category,
            description: token.description,
          });
        } else {
          // This is a nested object
          this.parseTokens(value, tokens, category, referenceMap, fullKey);
        }
      }
    }
  }

  private static mapTokenType(
    tokenStudioType: string,
    key: string,
  ): DesignToken["type"] {
    const typeMapping: { [key: string]: DesignToken["type"] } = {
      color: "color",
      text: "fontSize",
      number: "fontSize",
      dimension: "spacing",
      borderRadius: "borderRadius",
    };

    if (typeMapping[tokenStudioType]) {
      return typeMapping[tokenStudioType];
    }

    // Fallback to key-based inference
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes("color") || lowerKey.includes("solid"))
      return "color";
    if (
      lowerKey.includes("font-size") ||
      lowerKey.includes("h1") ||
      lowerKey.includes("h2")
    )
      return "fontSize";
    if (lowerKey.includes("weight")) return "fontWeight";
    if (lowerKey.includes("spacing") || lowerKey.includes("space"))
      return "spacing";
    if (lowerKey.includes("radius")) return "borderRadius";

    return "other";
  }
}
