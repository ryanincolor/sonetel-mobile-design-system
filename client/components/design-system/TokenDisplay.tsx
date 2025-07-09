import { DesignToken } from "@shared/design-tokens";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

interface TokenDisplayProps {
  token: DesignToken;
  showCode?: boolean;
  platform?: "web" | "ios" | "android";
}

export function TokenDisplay({
  token,
  showCode = false,
  platform = "web",
}: TokenDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getPlatformValue = (token: DesignToken, platform: string) => {
    switch (platform) {
      case "ios":
        if (token.type === "color") {
          return token.value.startsWith("#")
            ? `UIColor(named: "${token.name}")`
            : token.value;
        }
        if (token.type === "fontSize") {
          return `${parseFloat(token.value.replace("px", ""))}`;
        }
        return token.value;

      case "android":
        if (token.type === "color") {
          return `@color/${token.name.replace(/\./g, "_")}`;
        }
        if (token.type === "spacing" || token.type === "fontSize") {
          return `@dimen/${token.name.replace(/\./g, "_")}`;
        }
        return token.value;

      default:
        return token.value;
    }
  };

  const renderTokenPreview = () => {
    switch (token.type) {
      case "color":
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
              style={{ backgroundColor: token.value }}
            />
            <div className="flex-1">
              <p className="font-mono text-sm text-foreground">{token.value}</p>
              <p className="text-xs text-muted-foreground">
                RGB:{" "}
                {token.value.startsWith("#")
                  ? token.value
                      .slice(1)
                      .match(/.{2}/g)
                      ?.map((hex) => parseInt(hex, 16))
                      .join(", ")
                  : "N/A"}
              </p>
            </div>
          </div>
        );

      case "fontSize":
        const fontSize = parseFloat(token.value.replace("px", ""));
        return (
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-12 h-12 bg-secondary rounded-lg border-2 border-border"
              style={{ fontSize: Math.min(fontSize, 20) }}
            >
              Aa
            </div>
            <div className="flex-1">
              <p className="font-mono text-sm text-foreground">{token.value}</p>
              <p className="text-xs text-muted-foreground">
                {fontSize}px / {(fontSize * 0.75).toFixed(1)}pt
              </p>
            </div>
          </div>
        );

      case "spacing":
        const spacing = parseFloat(token.value.replace("px", ""));
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary rounded-lg border-2 border-border flex items-center justify-center">
              <div
                className="bg-primary rounded"
                style={{
                  width: Math.min(spacing / 2, 20),
                  height: Math.min(spacing / 2, 20),
                }}
              />
            </div>
            <div className="flex-1">
              <p className="font-mono text-sm text-foreground">{token.value}</p>
              <p className="text-xs text-muted-foreground">
                {spacing}px spacing
              </p>
            </div>
          </div>
        );

      case "borderRadius":
        const radius = parseFloat(token.value.replace("px", ""));
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 bg-primary border-2 border-border"
              style={{ borderRadius: radius }}
            />
            <div className="flex-1">
              <p className="font-mono text-sm text-foreground">{token.value}</p>
              <p className="text-xs text-muted-foreground">{radius}px radius</p>
            </div>
          </div>
        );

      case "fontWeight":
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary rounded-lg border-2 border-border flex items-center justify-center">
              <span
                className="text-sm"
                style={{ fontWeight: parseInt(token.value) }}
              >
                Aa
              </span>
            </div>
            <div className="flex-1">
              <p className="font-mono text-sm text-foreground">{token.value}</p>
              <p className="text-xs text-muted-foreground">Font weight</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary rounded-lg border-2 border-border flex items-center justify-center">
              <span className="text-xs text-muted-foreground">N/A</span>
            </div>
            <div className="flex-1">
              <p className="font-mono text-sm text-foreground">{token.value}</p>
              <p className="text-xs text-muted-foreground">{token.type}</p>
            </div>
          </div>
        );
    }
  };

  const platformValue = getPlatformValue(token, platform);

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-foreground text-sm">{token.name}</h3>
          {token.description && (
            <p className="text-xs text-muted-foreground mt-1">
              {token.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => copyToClipboard(platformValue)}
            className="p-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors active:scale-95"
            title={`Copy ${platform} value`}
          >
            {copied ? (
              <Check className="w-3 h-3 text-success" />
            ) : (
              <Copy className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
          {token.figmaReference && (
            <button
              onClick={() => window.open(token.figmaReference, "_blank")}
              className="p-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors active:scale-95"
              title="View in Figma"
            >
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {renderTokenPreview()}

      {showCode && (
        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase">
              {platform} Value
            </span>
            <button
              onClick={() => copyToClipboard(platformValue)}
              className="text-xs text-primary hover:text-primary/80"
            >
              Copy
            </button>
          </div>
          <code className="text-xs font-mono text-foreground break-all">
            {platformValue}
          </code>
        </div>
      )}
    </div>
  );
}

interface TokenGridProps {
  tokens: DesignToken[];
  platform?: "web" | "ios" | "android";
  showCode?: boolean;
}

export function TokenGrid({
  tokens,
  platform = "web",
  showCode = false,
}: TokenGridProps) {
  if (tokens.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tokens found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tokens.map((token) => (
        <TokenDisplay
          key={token.name}
          token={token}
          platform={platform}
          showCode={showCode}
        />
      ))}
    </div>
  );
}
