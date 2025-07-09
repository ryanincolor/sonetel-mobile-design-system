import { DesignToken, PlatformExport } from "@shared/design-tokens";

export class IOSExporter {
  private static formatSwiftVariableName(name: string): string {
    return name
      .split(".")
      .map((part, index) => {
        if (index === 0) return part.toLowerCase();
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join("");
  }

  private static formatSwiftColorValue(hexColor: string): string {
    if (!hexColor.startsWith("#")) return hexColor;

    const hex = hexColor.slice(1);
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      return `UIColor(red: ${r.toFixed(3)}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)}, alpha: 1.0)`;
    }
    return `UIColor(named: "${hexColor}")`;
  }

  private static formatSwiftFontSize(size: string): string {
    const numericValue = parseFloat(size.replace("px", ""));
    return numericValue.toString();
  }

  private static formatSwiftSpacing(spacing: string): string {
    const numericValue = parseFloat(spacing.replace("px", ""));
    return numericValue.toString();
  }

  static exportColors(tokens: DesignToken[]): PlatformExport {
    const colorTokens = tokens.filter((token) => token.type === "color");

    let swiftContent = `// Generated Design Tokens - Colors
// Auto-generated from Design System - Do not edit manually

import UIKit

extension UIColor {
    
    // MARK: - Design System Colors
    
`;

    colorTokens.forEach((token) => {
      const varName = this.formatSwiftVariableName(token.name);
      const colorValue = this.formatSwiftColorValue(token.value);
      const description = token.description
        ? `\n    /// ${token.description}`
        : "";

      swiftContent += `${description}
    static let ${varName} = ${colorValue}
    
`;
    });

    swiftContent += `}

// MARK: - Color Palette Struct (Alternative Usage)

struct DesignSystemColors {
    
`;

    colorTokens.forEach((token) => {
      const varName = this.formatSwiftVariableName(token.name);
      const description = token.description
        ? `\n    /// ${token.description}`
        : "";

      swiftContent += `${description}
    static let ${varName} = UIColor.${varName}
    
`;
    });

    swiftContent += `}
`;

    return {
      platform: "ios",
      format: "swift",
      content: swiftContent,
      filename: "DesignSystemColors.swift",
    };
  }

  static exportTypography(tokens: DesignToken[]): PlatformExport {
    const fontTokens = tokens.filter(
      (token) =>
        token.type === "fontFamily" ||
        token.type === "fontSize" ||
        token.type === "fontWeight",
    );

    let swiftContent = `// Generated Design Tokens - Typography
// Auto-generated from Design System - Do not edit manually

import UIKit

extension UIFont {
    
    // MARK: - Design System Typography
    
`;

    const fontSizes = fontTokens.filter((token) => token.type === "fontSize");
    const fontWeights = fontTokens.filter(
      (token) => token.type === "fontWeight",
    );
    const fontFamilies = fontTokens.filter(
      (token) => token.type === "fontFamily",
    );

    // Font size constants
    fontSizes.forEach((token) => {
      const varName = this.formatSwiftVariableName(token.name);
      const size = this.formatSwiftFontSize(token.value);
      const description = token.description
        ? `\n    /// ${token.description}`
        : "";

      swiftContent += `${description}
    static let ${varName}Size: CGFloat = ${size}
    
`;
    });

    // Font weight constants
    fontWeights.forEach((token) => {
      const varName = this.formatSwiftVariableName(token.name);
      const weightMap: { [key: string]: string } = {
        "100": ".ultraLight",
        "200": ".thin",
        "300": ".light",
        "400": ".regular",
        "500": ".medium",
        "600": ".semibold",
        "700": ".bold",
        "800": ".heavy",
        "900": ".black",
      };
      const weight = weightMap[token.value] || ".regular";
      const description = token.description
        ? `\n    /// ${token.description}`
        : "";

      swiftContent += `${description}
    static let ${varName}Weight: UIFont.Weight = ${weight}
    
`;
    });

    swiftContent += `}

// MARK: - Typography Helper Functions

extension UIFont {
    
    static func designSystem(size: CGFloat, weight: UIFont.Weight = .regular) -> UIFont {
        return UIFont.systemFont(ofSize: size, weight: weight)
    }
    
}

// MARK: - Typography Presets

struct DesignSystemTypography {
    
`;

    // Create typography presets combining size and weight
    const presets = [
      {
        name: "headingLarge",
        size: "typography.size.xl",
        weight: "typography.weight.bold",
      },
      {
        name: "headingMedium",
        size: "typography.size.lg",
        weight: "typography.weight.semibold",
      },
      {
        name: "bodyLarge",
        size: "typography.size.base",
        weight: "typography.weight.normal",
      },
      {
        name: "bodySmall",
        size: "typography.size.sm",
        weight: "typography.weight.normal",
      },
      {
        name: "caption",
        size: "typography.size.xs",
        weight: "typography.weight.medium",
      },
    ];

    presets.forEach((preset) => {
      const sizeToken = tokens.find((t) => t.name === preset.size);
      const weightToken = tokens.find((t) => t.name === preset.weight);

      if (sizeToken && weightToken) {
        const size = this.formatSwiftFontSize(sizeToken.value);
        const weightMap: { [key: string]: string } = {
          "400": ".regular",
          "500": ".medium",
          "600": ".semibold",
          "700": ".bold",
        };
        const weight = weightMap[weightToken.value] || ".regular";

        swiftContent += `    static let ${preset.name} = UIFont.systemFont(ofSize: ${size}, weight: ${weight})
    
`;
      }
    });

    swiftContent += `}
`;

    return {
      platform: "ios",
      format: "swift",
      content: swiftContent,
      filename: "DesignSystemTypography.swift",
    };
  }

  static exportSpacing(tokens: DesignToken[]): PlatformExport {
    const spacingTokens = tokens.filter((token) => token.type === "spacing");

    let swiftContent = `// Generated Design Tokens - Spacing
// Auto-generated from Design System - Do not edit manually

import UIKit

struct DesignSystemSpacing {
    
    // MARK: - Spacing Constants
    
`;

    spacingTokens.forEach((token) => {
      const varName = this.formatSwiftVariableName(token.name);
      const spacing = this.formatSwiftSpacing(token.value);
      const description = token.description
        ? `\n    /// ${token.description}`
        : "";

      swiftContent += `${description}
    static let ${varName}: CGFloat = ${spacing}
    
`;
    });

    swiftContent += `}

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
`;

    return {
      platform: "ios",
      format: "swift",
      content: swiftContent,
      filename: "DesignSystemSpacing.swift",
    };
  }

  static exportAll(tokens: DesignToken[]): PlatformExport[] {
    return [
      this.exportColors(tokens),
      this.exportTypography(tokens),
      this.exportSpacing(tokens),
    ];
  }
}
