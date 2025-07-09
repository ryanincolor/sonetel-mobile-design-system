import {
  TokenStudioTokenSet,
  TokenStudioToken,
  DesignToken,
  ColorToken,
  TypographyToken,
  SpacingToken,
} from "@shared/design-tokens";

export class TokenParser {
  private static parseTokenValue(token: TokenStudioToken): string {
    // Handle Token Studio references like {color.primary.500}
    if (
      typeof token.value === "string" &&
      token.value.startsWith("{") &&
      token.value.endsWith("}")
    ) {
      // For now, return as-is. In real implementation, you'd resolve references
      return token.value;
    }
    return token.value;
  }

  private static determineTokenType(
    key: string,
    token: TokenStudioToken,
  ): DesignToken["type"] {
    // Explicit type from Token Studio
    if (token.type) {
      const typeMapping: { [key: string]: DesignToken["type"] } = {
        color: "color",
        dimension: "dimension",
        fontFamilies: "fontFamily",
        fontWeights: "fontWeight",
        fontSize: "fontSize",
        lineHeights: "lineHeight",
        spacing: "spacing",
        borderRadius: "borderRadius",
        borderWidth: "borderWidth",
        opacity: "opacity",
        boxShadow: "boxShadow",
      };
      return typeMapping[token.type] || "other";
    }

    // Infer from key structure
    if (key.includes("color") || key.includes("bg") || key.includes("text"))
      return "color";
    if (key.includes("font-family")) return "fontFamily";
    if (key.includes("font-weight")) return "fontWeight";
    if (key.includes("font-size")) return "fontSize";
    if (key.includes("line-height")) return "lineHeight";
    if (
      key.includes("spacing") ||
      key.includes("margin") ||
      key.includes("padding")
    )
      return "spacing";
    if (key.includes("radius")) return "borderRadius";
    if (key.includes("border")) return "borderWidth";
    if (key.includes("opacity")) return "opacity";
    if (key.includes("shadow")) return "boxShadow";

    return "other";
  }

  private static flattenTokens(
    tokenSet: TokenStudioTokenSet,
    prefix = "",
  ): DesignToken[] {
    const tokens: DesignToken[] = [];

    for (const [key, value] of Object.entries(tokenSet)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if ("value" in value && "type" in value) {
        // This is a token
        const token = value as TokenStudioToken;
        tokens.push({
          name: fullKey,
          value: this.parseTokenValue(token),
          type: this.determineTokenType(fullKey, token),
          category: prefix || "global",
          description: token.description,
        });
      } else {
        // This is a nested token set
        tokens.push(
          ...this.flattenTokens(value as TokenStudioTokenSet, fullKey),
        );
      }
    }

    return tokens;
  }

  static parseTokenStudioJson(json: TokenStudioTokenSet): DesignToken[] {
    return this.flattenTokens(json);
  }

  static groupTokensByType(tokens: DesignToken[]): {
    [key: string]: DesignToken[];
  } {
    return tokens.reduce(
      (groups, token) => {
        const type = token.type;
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(token);
        return groups;
      },
      {} as { [key: string]: DesignToken[] },
    );
  }

  static groupTokensByCategory(tokens: DesignToken[]): {
    [key: string]: DesignToken[];
  } {
    return tokens.reduce(
      (groups, token) => {
        const category = token.category;
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(token);
        return groups;
      },
      {} as { [key: string]: DesignToken[] },
    );
  }
}

// Token management store
export class TokenStore {
  private static tokens: DesignToken[] = [];

  static setTokens(tokens: DesignToken[]) {
    this.tokens = tokens;
  }

  static getTokens(): DesignToken[] {
    return this.tokens;
  }

  static getTokensByType(type: DesignToken["type"]): DesignToken[] {
    return this.tokens.filter((token) => token.type === type);
  }

  static getTokensByCategory(category: string): DesignToken[] {
    return this.tokens.filter((token) => token.category === category);
  }

  static getToken(name: string): DesignToken | undefined {
    return this.tokens.find((token) => token.name === name);
  }

  static searchTokens(query: string): DesignToken[] {
    const lowerQuery = query.toLowerCase();
    return this.tokens.filter(
      (token) =>
        token.name.toLowerCase().includes(lowerQuery) ||
        token.description?.toLowerCase().includes(lowerQuery) ||
        token.value.toLowerCase().includes(lowerQuery),
    );
  }
}

// Mock tokens for development (replace with actual Token Studio import)
export const mockTokens: DesignToken[] = [
  // Colors
  {
    name: "color.primary.500",
    value: "#6366f1",
    type: "color",
    category: "color.primary",
  },
  {
    name: "color.primary.600",
    value: "#4f46e5",
    type: "color",
    category: "color.primary",
  },
  {
    name: "color.secondary.500",
    value: "#14b8a6",
    type: "color",
    category: "color.secondary",
  },
  {
    name: "color.neutral.50",
    value: "#fafafa",
    type: "color",
    category: "color.neutral",
  },
  {
    name: "color.neutral.900",
    value: "#171717",
    type: "color",
    category: "color.neutral",
  },

  // Typography
  {
    name: "typography.font.primary",
    value: "Inter, system-ui, sans-serif",
    type: "fontFamily",
    category: "typography",
  },
  {
    name: "typography.size.xs",
    value: "12px",
    type: "fontSize",
    category: "typography",
  },
  {
    name: "typography.size.sm",
    value: "14px",
    type: "fontSize",
    category: "typography",
  },
  {
    name: "typography.size.base",
    value: "16px",
    type: "fontSize",
    category: "typography",
  },
  {
    name: "typography.size.lg",
    value: "18px",
    type: "fontSize",
    category: "typography",
  },
  {
    name: "typography.size.xl",
    value: "20px",
    type: "fontSize",
    category: "typography",
  },
  {
    name: "typography.weight.normal",
    value: "400",
    type: "fontWeight",
    category: "typography",
  },
  {
    name: "typography.weight.medium",
    value: "500",
    type: "fontWeight",
    category: "typography",
  },
  {
    name: "typography.weight.semibold",
    value: "600",
    type: "fontWeight",
    category: "typography",
  },
  {
    name: "typography.weight.bold",
    value: "700",
    type: "fontWeight",
    category: "typography",
  },

  // Spacing
  { name: "spacing.xs", value: "4px", type: "spacing", category: "spacing" },
  { name: "spacing.sm", value: "8px", type: "spacing", category: "spacing" },
  { name: "spacing.md", value: "16px", type: "spacing", category: "spacing" },
  { name: "spacing.lg", value: "24px", type: "spacing", category: "spacing" },
  { name: "spacing.xl", value: "32px", type: "spacing", category: "spacing" },

  // Border Radius
  { name: "radius.sm", value: "4px", type: "borderRadius", category: "radius" },
  { name: "radius.md", value: "8px", type: "borderRadius", category: "radius" },
  {
    name: "radius.lg",
    value: "12px",
    type: "borderRadius",
    category: "radius",
  },
  {
    name: "radius.full",
    value: "9999px",
    type: "borderRadius",
    category: "radius",
  },
];

// Initialize with mock tokens
TokenStore.setTokens(mockTokens);
