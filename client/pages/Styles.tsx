import { useState } from "react";

interface TypographyVariant {
  name: string;
  light: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
    letterSpacing: string;
  };
  regular: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
    letterSpacing: string;
  };
  prominent: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
    letterSpacing: string;
  };
}

const typographyVariants: TypographyVariant[] = [
  {
    name: "Display Medium",
    light: {
      fontSize: "64px",
      lineHeight: "64px",
      fontWeight: "300",
      letterSpacing: "-1.28px",
    },
    regular: {
      fontSize: "64px",
      lineHeight: "64px",
      fontWeight: "500",
      letterSpacing: "-1.28px",
    },
    prominent: {
      fontSize: "64px",
      lineHeight: "64px",
      fontWeight: "600",
      letterSpacing: "-1.28px",
    },
  },
  {
    name: "Headline 3xl",
    light: {
      fontSize: "40px",
      lineHeight: "46px",
      fontWeight: "500",
      letterSpacing: "-0.8px",
    },
    regular: {
      fontSize: "40px",
      lineHeight: "46px",
      fontWeight: "600",
      letterSpacing: "-0.8px",
    },
    prominent: {
      fontSize: "40px",
      lineHeight: "46px",
      fontWeight: "700",
      letterSpacing: "-0.8px",
    },
  },
  {
    name: "Headline 2xl",
    light: {
      fontSize: "34px",
      lineHeight: "40px",
      fontWeight: "500",
      letterSpacing: "-0.68px",
    },
    regular: {
      fontSize: "34px",
      lineHeight: "40px",
      fontWeight: "600",
      letterSpacing: "-0.68px",
    },
    prominent: {
      fontSize: "34px",
      lineHeight: "40px",
      fontWeight: "700",
      letterSpacing: "-0.68px",
    },
  },
  {
    name: "Headline XL",
    light: {
      fontSize: "28px",
      lineHeight: "32px",
      fontWeight: "500",
      letterSpacing: "-0.56px",
    },
    regular: {
      fontSize: "28px",
      lineHeight: "32px",
      fontWeight: "600",
      letterSpacing: "-0.56px",
    },
    prominent: {
      fontSize: "28px",
      lineHeight: "32px",
      fontWeight: "700",
      letterSpacing: "-0.56px",
    },
  },
  {
    name: "Headline Large",
    light: {
      fontSize: "24px",
      lineHeight: "29px",
      fontWeight: "500",
      letterSpacing: "-0.48px",
    },
    regular: {
      fontSize: "24px",
      lineHeight: "29px",
      fontWeight: "600",
      letterSpacing: "-0.48px",
    },
    prominent: {
      fontSize: "24px",
      lineHeight: "29px",
      fontWeight: "700",
      letterSpacing: "-0.48px",
    },
  },
  {
    name: "Headline Medium",
    light: {
      fontSize: "20px",
      lineHeight: "24px",
      fontWeight: "500",
      letterSpacing: "-0.4px",
    },
    regular: {
      fontSize: "20px",
      lineHeight: "24px",
      fontWeight: "600",
      letterSpacing: "-0.4px",
    },
    prominent: {
      fontSize: "20px",
      lineHeight: "24px",
      fontWeight: "700",
      letterSpacing: "-0.4px",
    },
  },
  {
    name: "Headline Small",
    light: {
      fontSize: "18px",
      lineHeight: "22px",
      fontWeight: "500",
      letterSpacing: "-0.36px",
    },
    regular: {
      fontSize: "18px",
      lineHeight: "22px",
      fontWeight: "600",
      letterSpacing: "-0.36px",
    },
    prominent: {
      fontSize: "18px",
      lineHeight: "22px",
      fontWeight: "700",
      letterSpacing: "-0.36px",
    },
  },
];

const labelAndBodyStyles = [
  {
    name: "Label X-Large",
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: "500",
    letterSpacing: "-0.32px",
  },
  {
    name: "Label Large",
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: "500",
    letterSpacing: "-0.28px",
  },
  {
    name: "Label Medium",
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: "500",
    letterSpacing: "-0.24px",
  },
  {
    name: "Label Small",
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: "500",
    letterSpacing: "-0.22px",
  },
  {
    name: "Body X-Large Regular",
    fontSize: "20px",
    lineHeight: "22px",
    fontWeight: "400",
    letterSpacing: "-0.4px",
  },
  {
    name: "Body X-Large Prominent",
    fontSize: "20px",
    lineHeight: "22px",
    fontWeight: "500",
    letterSpacing: "-0.4px",
  },
  {
    name: "Body Large Regular",
    fontSize: "16px",
    lineHeight: "20px",
    fontWeight: "400",
    letterSpacing: "-0.32px",
  },
  {
    name: "Body Large Prominent",
    fontSize: "16px",
    lineHeight: "20px",
    fontWeight: "500",
    letterSpacing: "-0.32px",
  },
  {
    name: "Body Medium Regular",
    fontSize: "14px",
    lineHeight: "18px",
    fontWeight: "400",
    letterSpacing: "-0.28px",
  },
  {
    name: "Body Medium Prominent",
    fontSize: "14px",
    lineHeight: "18px",
    fontWeight: "500",
    letterSpacing: "-0.28px",
  },
  {
    name: "Body Small Regular",
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: "400",
    letterSpacing: "-0.24px",
  },
  {
    name: "Body Small Prominent",
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: "500",
    letterSpacing: "-0.24px",
  },
];

export default function Styles() {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Typography</h1>
        <p className="text-muted-foreground">
          Typography styles with Light, Regular, and Prominent weight variants
          following Sonetel design specifications.
        </p>
      </div>

      {/* Typeface Introduction */}
      <div className="mb-12 p-6 bg-card rounded-lg border">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Inter</h2>
          <div
            className="text-8xl font-normal leading-none mb-4"
            style={{
              fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
            }}
          >
            Ag
          </div>
          <div
            className="text-base text-muted-foreground"
            style={{
              fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
            }}
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
            !@#$%^&*()
          </div>
        </div>
      </div>

      {/* Display & Headlines */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Display & Headlines</h2>
        <div className="space-y-8">
          {typographyVariants.map((variant, index) => (
            <div
              key={variant.name}
              className="border-b border-border pb-8 last:border-b-0"
            >
              {/* Header with specifications */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-border/50">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {variant.name}
                </h3>
                <span className="text-sm text-muted-foreground">
                  Font size: {variant.regular.fontSize} / Line height:{" "}
                  {variant.regular.lineHeight} / Letter spacing: -2%
                </span>
              </div>

              {/* Typography variants */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Light */}
                <div>
                  <div
                    className="text-foreground leading-none mb-2"
                    style={{
                      fontSize: variant.light.fontSize,
                      lineHeight: variant.light.lineHeight,
                      fontWeight: variant.light.fontWeight,
                      letterSpacing: variant.light.letterSpacing,
                      fontFamily:
                        "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                    }}
                  >
                    {variant.name}
                    <br />
                    Light
                  </div>
                </div>

                {/* Regular */}
                <div>
                  <div
                    className="text-foreground leading-none mb-2"
                    style={{
                      fontSize: variant.regular.fontSize,
                      lineHeight: variant.regular.lineHeight,
                      fontWeight: variant.regular.fontWeight,
                      letterSpacing: variant.regular.letterSpacing,
                      fontFamily:
                        "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                    }}
                  >
                    {variant.name}
                    <br />
                    Regular
                  </div>
                </div>

                {/* Prominent */}
                <div>
                  <div
                    className="text-foreground leading-none mb-2"
                    style={{
                      fontSize: variant.prominent.fontSize,
                      lineHeight: variant.prominent.lineHeight,
                      fontWeight: variant.prominent.fontWeight,
                      letterSpacing: variant.prominent.letterSpacing,
                      fontFamily:
                        "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                    }}
                  >
                    {variant.name}
                    <br />
                    Prominent
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Labels & Body Text */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Labels & Body Text</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labelAndBodyStyles.map((style) => (
            <div key={style.name} className="p-4 bg-card rounded-lg border">
              <div className="mb-3">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {style.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {style.fontSize} / {style.lineHeight} /{" "}
                  {style.fontWeight === "400" ? "Regular" : "Medium"}
                </p>
              </div>
              <div
                className="text-foreground"
                style={{
                  fontSize: style.fontSize,
                  lineHeight: style.lineHeight,
                  fontWeight: style.fontWeight,
                  letterSpacing: style.letterSpacing,
                  fontFamily:
                    "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                The quick brown fox jumps over the lazy dog
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Usage Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Weight Variations</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <strong>Light:</strong> Use for supporting headlines and
                subtitles
              </li>
              <li>
                <strong>Regular:</strong> Primary weight for most headline usage
              </li>
              <li>
                <strong>Prominent:</strong> Use for emphasis and key messaging
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Implementation</h3>
            <div className="text-sm font-mono bg-muted p-3 rounded">
              {/* Android */}
              <div className="mb-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Android:
                </div>
                SonetelTypography.Headline3xl.prominent
              </div>
              {/* iOS */}
              <div>
                <div className="text-xs text-muted-foreground mb-1">iOS:</div>
                Coming soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
