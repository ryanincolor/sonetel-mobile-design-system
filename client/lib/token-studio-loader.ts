import {
  TokenStudioTokenSet,
  TokenStudioToken,
  DesignToken,
} from "@shared/design-tokens";

export interface TokenStudioFiles {
  metadata: {
    tokenSetOrder: string[];
  };
  themes: any;
  tokenSets: { [key: string]: TokenStudioTokenSet };
}

export class TokenStudioLoader {
  private static tokenCache: Map<string, any> = new Map();

  static async loadTokenFiles(): Promise<TokenStudioFiles> {
    try {
      // Load metadata
      const metadataResponse = await fetch("/tokens/$metadata.json");
      const metadata = await metadataResponse.json();

      // Load themes
      const themesResponse = await fetch("/tokens/$themes.json");
      const themes = await themesResponse.json();

      // Load all token set files based on metadata
      const tokenSets: { [key: string]: TokenStudioTokenSet } = {};

      for (const tokenSetName of metadata.tokenSetOrder) {
        // Convert token set name to file path
        const filePath = `/tokens/${tokenSetName}.json`;
        try {
          const response = await fetch(filePath);
          if (response.ok) {
            const tokenSet = await response.json();
            tokenSets[tokenSetName] = tokenSet;
            this.tokenCache.set(tokenSetName, tokenSet);
            console.log(
              `Loaded token set: ${tokenSetName}`,
              Object.keys(tokenSet).length,
              "tokens",
            );
          } else {
            console.warn(
              `Failed to fetch token set: ${tokenSetName} (${response.status})`,
            );
          }
        } catch (error) {
          console.warn(`Failed to load token set: ${tokenSetName}`, error);
        }
      }

      return { metadata, themes, tokenSets };
    } catch (error) {
      console.error("Failed to load Token Studio files:", error);
      throw error;
    }
  }

  static resolveTokenReferences(
    value: string,
    allTokenSets: { [key: string]: TokenStudioTokenSet },
  ): string {
    // Handle Token Studio references like {color.primary.500} or {Neutral.Solid.96W}
    if (
      typeof value === "string" &&
      value.startsWith("{") &&
      value.endsWith("}")
    ) {
      const reference = value.slice(1, -1); // Remove { and }

      // Try to find the token in all token sets
      for (const [setName, tokenSet] of Object.entries(allTokenSets)) {
        const resolvedValue = this.findTokenInSet(reference, tokenSet);
        if (resolvedValue) {
          // Recursively resolve in case the found token also has references
          return this.resolveTokenReferences(resolvedValue, allTokenSets);
        }
      }

      // If not found, return the original reference
      console.warn(`Token reference not found: ${reference}`);
      return value;
    }

    return value;
  }

  private static findTokenInSet(
    path: string,
    tokenSet: TokenStudioTokenSet,
  ): string | null {
    const parts = path.split(".");
    let current: any = tokenSet;

    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return null;
      }
    }

    // If we found a token object with a value, return it
    if (current && typeof current === "object" && "value" in current) {
      return current.value;
    }

    return null;
  }

  static flattenTokenSet(
    tokenSet: TokenStudioTokenSet,
    prefix = "",
    category = "global",
    allTokenSets: { [key: string]: TokenStudioTokenSet } = {},
  ): DesignToken[] {
    const tokens: DesignToken[] = [];

    for (const [key, value] of Object.entries(tokenSet)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (this.isToken(value)) {
        // This is a token
        const token = value as TokenStudioToken;
        const resolvedValue = this.resolveTokenReferences(
          token.value,
          allTokenSets,
        );

        tokens.push({
          name: fullKey,
          value: resolvedValue,
          type: this.mapTokenType(token.type, fullKey),
          category: this.determineCategory(fullKey, category),
          description: token.description,
        });
      } else if (typeof value === "object" && value !== null) {
        // This is a nested token set
        tokens.push(
          ...this.flattenTokenSet(
            value as TokenStudioTokenSet,
            fullKey,
            this.determineCategory(fullKey, category),
            allTokenSets,
          ),
        );
      }
    }

    return tokens;
  }

  private static isToken(value: any): boolean {
    return (
      typeof value === "object" &&
      value !== null &&
      "value" in value &&
      "type" in value
    );
  }

  private static mapTokenType(
    tokenStudioType: string,
    key: string,
  ): DesignToken["type"] {
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

    if (typeMapping[tokenStudioType]) {
      return typeMapping[tokenStudioType];
    }

    // Fallback to key-based inference
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes("color") || lowerKey.includes("bg")) return "color";
    if (lowerKey.includes("spacing") || lowerKey.includes("space"))
      return "spacing";
    if (lowerKey.includes("font")) return "fontSize";
    if (lowerKey.includes("radius")) return "borderRadius";

    return "other";
  }

  private static determineCategory(
    key: string,
    parentCategory: string,
  ): string {
    const parts = key.split(".");

    // Use the first meaningful part as category
    if (parts.length > 1) {
      return parts[0].toLowerCase();
    }

    return parentCategory;
  }

  static async loadAndParseTokens(): Promise<DesignToken[]> {
    try {
      console.log("Starting token loading...");
      const { tokenSets, metadata } = await this.loadTokenFiles();
      const allTokens: DesignToken[] = [];

      console.log("Loaded token sets:", Object.keys(tokenSets));
      console.log("Token set order:", metadata.tokenSetOrder);

      // Process token sets in order (Core first, then Sys)
      for (const tokenSetName of metadata.tokenSetOrder) {
        if (tokenSets[tokenSetName]) {
          console.log(`Processing token set: ${tokenSetName}`);
          const setTokens = this.flattenTokenSet(
            tokenSets[tokenSetName],
            "",
            tokenSetName.split("/")[0].toLowerCase(), // Use 'core' or 'sys' as base category
            tokenSets,
          );
          allTokens.push(...setTokens);
          console.log(`Added ${setTokens.length} tokens from ${tokenSetName}`);
        } else {
          console.warn(`Token set not found: ${tokenSetName}`);
        }
      }

      console.log(`Total tokens loaded: ${allTokens.length}`);
      return allTokens;
    } catch (error) {
      console.error("Failed to load and parse tokens:", error);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }
  }

  static getCoreTokens(allTokens: DesignToken[]): DesignToken[] {
    return allTokens.filter((token) => token.category.startsWith("core"));
  }

  static getSystemTokens(allTokens: DesignToken[]): DesignToken[] {
    return allTokens.filter((token) => token.category.startsWith("sys"));
  }

  static getTokensByCategory(
    allTokens: DesignToken[],
    category: string,
  ): DesignToken[] {
    return allTokens.filter((token) =>
      token.category.toLowerCase().includes(category.toLowerCase()),
    );
  }
}
