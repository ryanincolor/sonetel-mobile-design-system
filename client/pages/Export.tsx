import { useState } from "react";
import { Download, Code, Copy, Check, Smartphone, Monitor } from "lucide-react";
import { mockTokens } from "@/lib/tokens";
import { IOSExporter } from "@/lib/exporters/ios";
import { AndroidExporter } from "@/lib/exporters/android";
import { PlatformExport } from "@shared/design-tokens";

export default function Export() {
  const [selectedPlatform, setSelectedPlatform] = useState<
    "ios" | "android" | "all"
  >("all");
  const [selectedFormat, setSelectedFormat] = useState<
    "swift" | "kotlin" | "xml"
  >("swift");
  const [exports, setExports] = useState<PlatformExport[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateExports = async () => {
    setIsGenerating(true);

    // Simulate async generation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let newExports: PlatformExport[] = [];

    if (selectedPlatform === "ios" || selectedPlatform === "all") {
      newExports.push(...IOSExporter.exportAll(mockTokens));
    }

    if (selectedPlatform === "android" || selectedPlatform === "all") {
      newExports.push(...AndroidExporter.exportAll(mockTokens));
    }

    setExports(newExports);
    setIsGenerating(false);
  };

  const copyToClipboard = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadFile = (exportData: PlatformExport) => {
    const blob = new Blob([exportData.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportData.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    exports.forEach((exportData) => {
      downloadFile(exportData);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Export Tokens
              </h1>
              <p className="text-muted-foreground mt-1">
                Generate platform-specific code from design tokens
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Export Configuration */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Export Configuration
              </h2>

              {/* Platform Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Platform
                </label>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Platforms", icon: Monitor },
                    { value: "ios", label: "iOS", icon: Smartphone },
                    { value: "android", label: "Android", icon: Smartphone },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-secondary/50 transition-colors"
                    >
                      <input
                        type="radio"
                        value={option.value}
                        checked={selectedPlatform === option.value}
                        onChange={(e) =>
                          setSelectedPlatform(
                            e.target.value as typeof selectedPlatform,
                          )
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <option.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Token Summary */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Token Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Colors</span>
                    <span className="font-medium">
                      {mockTokens.filter((t) => t.type === "color").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Typography</span>
                    <span className="font-medium">
                      {
                        mockTokens.filter((t) =>
                          ["fontSize", "fontWeight", "fontFamily"].includes(
                            t.type,
                          ),
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Spacing</span>
                    <span className="font-medium">
                      {mockTokens.filter((t) => t.type === "spacing").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Other</span>
                    <span className="font-medium">
                      {
                        mockTokens.filter(
                          (t) =>
                            ![
                              "color",
                              "fontSize",
                              "fontWeight",
                              "fontFamily",
                              "spacing",
                            ].includes(t.type),
                        ).length
                      }
                    </span>
                  </div>
                  <hr className="border-border my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{mockTokens.length}</span>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateExports}
                disabled={isGenerating}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4" />
                    Generate Code
                  </>
                )}
              </button>

              {exports.length > 0 && (
                <button
                  onClick={downloadAll}
                  className="btn-secondary w-full mt-3 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download All Files
                </button>
              )}
            </div>
          </div>

          {/* Generated Code */}
          <div className="lg:col-span-2">
            {exports.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Code className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Ready to Generate
                </h3>
                <p className="text-muted-foreground">
                  Configure your export settings and click "Generate Code" to
                  create platform-specific tokens
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    Generated Files
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {exports.length} files generated
                  </span>
                </div>

                {exports.map((exportData, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl border border-border overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            exportData.platform === "ios"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">
                            {exportData.filename}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {exportData.platform.toUpperCase()} •{" "}
                            {exportData.format.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            copyToClipboard(exportData.content, index)
                          }
                          className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                        <button
                          onClick={() => downloadFile(exportData)}
                          className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                          title="Download file"
                        >
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-x-auto">
                        <code className="text-foreground">
                          {exportData.content}
                        </code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
