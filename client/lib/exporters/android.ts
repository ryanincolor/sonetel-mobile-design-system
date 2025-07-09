import { DesignToken, PlatformExport } from "@shared/design-tokens";

export class AndroidExporter {
  private static formatKotlinVariableName(name: string): string {
    return name
      .split(".")
      .map((part, index) => {
        if (index === 0) return part.toLowerCase();
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join("");
  }

  private static formatXMLResourceName(name: string): string {
    return name.replace(/\./g, "_").toLowerCase();
  }

  private static formatAndroidColorValue(hexColor: string): string {
    if (!hexColor.startsWith("#")) return hexColor;
    return hexColor.toUpperCase();
  }

  private static formatAndroidDimension(value: string): string {
    const numericValue = parseFloat(value.replace("px", ""));
    return `${numericValue}dp`;
  }

  private static formatAndroidTextSize(value: string): string {
    const numericValue = parseFloat(value.replace("px", ""));
    return `${numericValue}sp`;
  }

  static exportColorsXML(tokens: DesignToken[]): PlatformExport {
    const colorTokens = tokens.filter((token) => token.type === "color");

    let xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generated Design Tokens - Colors -->
<!-- Auto-generated from Design System - Do not edit manually -->

<resources>
    
`;

    colorTokens.forEach((token) => {
      const resourceName = this.formatXMLResourceName(token.name);
      const colorValue = this.formatAndroidColorValue(token.value);
      const description = token.description
        ? `\n    <!-- ${token.description} -->`
        : "";

      xmlContent += `${description}
    <color name="${resourceName}">${colorValue}</color>
    
`;
    });

    xmlContent += `</resources>
`;

    return {
      platform: "android",
      format: "xml",
      content: xmlContent,
      filename: "colors.xml",
    };
  }

  static exportColorsKotlin(tokens: DesignToken[]): PlatformExport {
    const colorTokens = tokens.filter((token) => token.type === "color");

    let kotlinContent = `// Generated Design Tokens - Colors
// Auto-generated from Design System - Do not edit manually

package com.yourapp.designsystem

import androidx.compose.ui.graphics.Color

object DesignSystemColors {
    
`;

    colorTokens.forEach((token) => {
      const varName = this.formatKotlinVariableName(token.name);
      const description = token.description
        ? `\n    /** ${token.description} */`
        : "";

      // Convert hex to Compose Color
      let colorValue = token.value;
      if (colorValue.startsWith("#")) {
        const hex = colorValue.slice(1);
        if (hex.length === 6) {
          colorValue = `Color(0xFF${hex.toUpperCase()})`;
        }
      }

      kotlinContent += `${description}
    val ${varName} = ${colorValue}
    
`;
    });

    kotlinContent += `}

// Extension for easy access
val androidx.compose.material3.ColorScheme.designSystem: DesignSystemColors
    get() = DesignSystemColors
`;

    return {
      platform: "android",
      format: "kotlin",
      content: kotlinContent,
      filename: "DesignSystemColors.kt",
    };
  }

  static exportDimensionsXML(tokens: DesignToken[]): PlatformExport {
    const dimensionTokens = tokens.filter(
      (token) =>
        token.type === "spacing" ||
        token.type === "fontSize" ||
        token.type === "borderRadius",
    );

    let xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generated Design Tokens - Dimensions -->
<!-- Auto-generated from Design System - Do not edit manually -->

<resources>
    
`;

    // Spacing
    const spacingTokens = dimensionTokens.filter((t) => t.type === "spacing");
    if (spacingTokens.length > 0) {
      xmlContent += `    <!-- Spacing -->\n`;
      spacingTokens.forEach((token) => {
        const resourceName = this.formatXMLResourceName(token.name);
        const dimensionValue = this.formatAndroidDimension(token.value);
        const description = token.description
          ? `\n    <!-- ${token.description} -->`
          : "";

        xmlContent += `${description}
    <dimen name="${resourceName}">${dimensionValue}</dimen>
    
`;
      });
    }

    // Text sizes
    const textSizeTokens = dimensionTokens.filter((t) => t.type === "fontSize");
    if (textSizeTokens.length > 0) {
      xmlContent += `    <!-- Text Sizes -->\n`;
      textSizeTokens.forEach((token) => {
        const resourceName = this.formatXMLResourceName(token.name);
        const textSize = this.formatAndroidTextSize(token.value);
        const description = token.description
          ? `\n    <!-- ${token.description} -->`
          : "";

        xmlContent += `${description}
    <dimen name="${resourceName}">${textSize}</dimen>
    
`;
      });
    }

    // Border radius
    const radiusTokens = dimensionTokens.filter(
      (t) => t.type === "borderRadius",
    );
    if (radiusTokens.length > 0) {
      xmlContent += `    <!-- Border Radius -->\n`;
      radiusTokens.forEach((token) => {
        const resourceName = this.formatXMLResourceName(token.name);
        const radiusValue = this.formatAndroidDimension(token.value);
        const description = token.description
          ? `\n    <!-- ${token.description} -->`
          : "";

        xmlContent += `${description}
    <dimen name="${resourceName}">${radiusValue}</dimen>
    
`;
      });
    }

    xmlContent += `</resources>
`;

    return {
      platform: "android",
      format: "xml",
      content: xmlContent,
      filename: "dimens.xml",
    };
  }

  static exportTypographyKotlin(tokens: DesignToken[]): PlatformExport {
    const typographyTokens = tokens.filter(
      (token) =>
        token.type === "fontFamily" ||
        token.type === "fontSize" ||
        token.type === "fontWeight",
    );

    let kotlinContent = `// Generated Design Tokens - Typography
// Auto-generated from Design System - Do not edit manually

package com.yourapp.designsystem

import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

object DesignSystemTypography {
    
`;

    // Font size constants
    const fontSizes = typographyTokens.filter(
      (token) => token.type === "fontSize",
    );
    fontSizes.forEach((token) => {
      const varName = this.formatKotlinVariableName(token.name);
      const size = parseFloat(token.value.replace("px", ""));
      const description = token.description
        ? `\n    /** ${token.description} */`
        : "";

      kotlinContent += `${description}
    val ${varName}Size = ${size}.sp
    
`;
    });

    // Font weight constants
    const fontWeights = typographyTokens.filter(
      (token) => token.type === "fontWeight",
    );
    fontWeights.forEach((token) => {
      const varName = this.formatKotlinVariableName(token.name);
      const weightMap: { [key: string]: string } = {
        "100": "FontWeight.Thin",
        "200": "FontWeight.ExtraLight",
        "300": "FontWeight.Light",
        "400": "FontWeight.Normal",
        "500": "FontWeight.Medium",
        "600": "FontWeight.SemiBold",
        "700": "FontWeight.Bold",
        "800": "FontWeight.ExtraBold",
        "900": "FontWeight.Black",
      };
      const weight = weightMap[token.value] || "FontWeight.Normal";
      const description = token.description
        ? `\n    /** ${token.description} */`
        : "";

      kotlinContent += `${description}
    val ${varName}Weight = ${weight}
    
`;
    });

    // Typography presets
    kotlinContent += `    // Typography Presets
    
    val headingLarge = TextStyle(
        fontSize = typographySizeXlSize,
        fontWeight = typographyWeightBoldWeight
    )
    
    val headingMedium = TextStyle(
        fontSize = typographySizeLgSize,
        fontWeight = typographyWeightSemiboldWeight
    )
    
    val bodyLarge = TextStyle(
        fontSize = typographySizeBaseSize,
        fontWeight = typographyWeightNormalWeight
    )
    
    val bodySmall = TextStyle(
        fontSize = typographySizeSmSize,
        fontWeight = typographyWeightNormalWeight
    )
    
    val caption = TextStyle(
        fontSize = typographySizeXsSize,
        fontWeight = typographyWeightMediumWeight
    )
    
`;

    kotlinContent += `}
`;

    return {
      platform: "android",
      format: "kotlin",
      content: kotlinContent,
      filename: "DesignSystemTypography.kt",
    };
  }

  static exportSpacingKotlin(tokens: DesignToken[]): PlatformExport {
    const spacingTokens = tokens.filter((token) => token.type === "spacing");

    let kotlinContent = `// Generated Design Tokens - Spacing
// Auto-generated from Design System - Do not edit manually

package com.yourapp.designsystem

import androidx.compose.ui.unit.dp

object DesignSystemSpacing {
    
`;

    spacingTokens.forEach((token) => {
      const varName = this.formatKotlinVariableName(token.name);
      const spacing = parseFloat(token.value.replace("px", ""));
      const description = token.description
        ? `\n    /** ${token.description} */`
        : "";

      kotlinContent += `${description}
    val ${varName} = ${spacing}.dp
    
`;
    });

    kotlinContent += `}
`;

    return {
      platform: "android",
      format: "kotlin",
      content: kotlinContent,
      filename: "DesignSystemSpacing.kt",
    };
  }

  static exportAll(tokens: DesignToken[]): PlatformExport[] {
    return [
      this.exportColorsXML(tokens),
      this.exportColorsKotlin(tokens),
      this.exportDimensionsXML(tokens),
      this.exportTypographyKotlin(tokens),
      this.exportSpacingKotlin(tokens),
    ];
  }
}
