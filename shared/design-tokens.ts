// Design token interfaces for Token Studio integration

export interface TokenStudioToken {
  value: string;
  type: string;
  description?: string;
  extensions?: {
    [key: string]: any;
  };
}

export interface TokenStudioTokenSet {
  [key: string]: TokenStudioToken | TokenStudioTokenSet;
}

export interface DesignToken {
  name: string;
  value: string;
  type:
    | "color"
    | "dimension"
    | "fontFamily"
    | "fontWeight"
    | "fontSize"
    | "lineHeight"
    | "spacing"
    | "borderRadius"
    | "borderWidth"
    | "opacity"
    | "boxShadow"
    | "other";
  category: string;
  description?: string;
  figmaReference?: string;
}

export interface ColorToken extends DesignToken {
  type: "color";
  value: string; // hex, rgb, hsl
  contrast?: {
    light: number;
    dark: number;
  };
}

export interface TypographyToken extends DesignToken {
  type: "fontFamily" | "fontWeight" | "fontSize" | "lineHeight";
  value: string;
  platform?: {
    ios: string;
    android: string;
    web: string;
  };
}

export interface SpacingToken extends DesignToken {
  type: "spacing" | "dimension";
  value: string;
  pixelValue: number;
}

export interface ComponentToken {
  name: string;
  description?: string;
  properties: DesignToken[];
  variants?: {
    [key: string]: ComponentToken;
  };
  platforms: {
    figma?: string;
    ios?: {
      component: string;
      implementation: string;
    };
    android?: {
      component: string;
      implementation: string;
    };
    web?: {
      component: string;
      implementation: string;
    };
  };
}

export interface PlatformExport {
  platform: "ios" | "android" | "web";
  format: "swift" | "kotlin" | "xml" | "json" | "css" | "scss";
  content: string;
  filename: string;
}
