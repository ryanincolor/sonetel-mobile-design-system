import {
  TokenStudioTokenSet,
  TokenStudioToken,
  DesignToken,
  ColorToken,
  TypographyToken,
  SpacingToken,
} from "@shared/design-tokens";
import { TokenStudioLoader } from "./token-studio-loader";
import { SimpleTokenLoader } from "./simple-token-loader";

export class TokenParser {
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

  static getCoreTokens(tokens: DesignToken[]): DesignToken[] {
    return tokens.filter((token) =>
      token.category.toLowerCase().startsWith("core"),
    );
  }

  static getSystemTokens(tokens: DesignToken[]): DesignToken[] {
    return tokens.filter((token) =>
      token.category.toLowerCase().startsWith("sys"),
    );
  }

  static getColorTokens(tokens: DesignToken[]): DesignToken[] {
    return tokens.filter((token) => token.type === "color");
  }

  static getTypographyTokens(tokens: DesignToken[]): DesignToken[] {
    return tokens.filter((token) =>
      ["fontFamily", "fontWeight", "fontSize", "lineHeight"].includes(
        token.type,
      ),
    );
  }

  static getSpacingTokens(tokens: DesignToken[]): DesignToken[] {
    return tokens.filter((token) =>
      ["spacing", "dimension"].includes(token.type),
    );
  }
}

// Token management store
export class TokenStore {
  private static tokens: DesignToken[] = [];
  private static loaded = false;
  private static loading = false;

  static async loadTokens(): Promise<DesignToken[]> {
    if (this.loaded) {
      console.log("Tokens already loaded:", this.tokens.length);
      return this.tokens;
    }

    if (this.loading) {
      // Wait for ongoing load
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (this.loaded) {
            resolve(this.tokens);
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    this.loading = true;
    console.log("Loading mobile tokens from Sys folder...");

    try {
      // Try to load mobile/sys tokens first
      const sysTokens = await SimpleTokenLoader.loadSysTokens();

      if (sysTokens.length > 0) {
        console.log(
          `Successfully loaded ${sysTokens.length} mobile tokens from Sys folder`,
        );
        this.tokens = sysTokens;
      } else {
        console.warn(
          "No Sys tokens loaded, trying full Token Studio loader...",
        );
        const loadedTokens = await TokenStudioLoader.loadAndParseTokens();

        if (loadedTokens.length > 0) {
          console.log(
            `Successfully loaded ${loadedTokens.length} tokens from Token Studio`,
          );
          this.tokens = loadedTokens;
        } else {
          console.warn("No tokens loaded, using mock data");
          this.tokens = mockTokens;
        }
      }

      this.loaded = true;
      this.loading = false;
      return this.tokens;
    } catch (error) {
      console.error("Failed to load tokens, falling back to mock data:", error);
      this.tokens = mockTokens;
      this.loaded = true;
      this.loading = false;
      return this.tokens;
    }
  }

  static setTokens(tokens: DesignToken[]) {
    this.tokens = tokens;
    this.loaded = true;
  }

  static getTokens(): DesignToken[] {
    return this.tokens;
  }

  static getTokensByType(type: DesignToken["type"]): DesignToken[] {
    return this.tokens.filter((token) => token.type === type);
  }

  static getTokensByCategory(category: string): DesignToken[] {
    return this.tokens.filter((token) => token.category.includes(category));
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

  static getCoreTokens(): DesignToken[] {
    return TokenParser.getCoreTokens(this.tokens);
  }

  static getSystemTokens(): DesignToken[] {
    return TokenParser.getSystemTokens(this.tokens);
  }

  static isLoaded(): boolean {
    return this.loaded;
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
