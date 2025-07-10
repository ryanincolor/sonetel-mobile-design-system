import { useState, useEffect } from "react";
import { Search, Palette, Type, Ruler } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Token {
  name: string;
  value: string;
  type: string;
  category: string;
  mode?: string;
  originalValue?: string;
}

export default function Tokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const response = await fetch("/api/tokens/list");
      if (response.ok) {
        const data = await response.json();
        setTokens(data);
      } else {
        console.error("Failed to load tokens");
      }
    } catch (error) {
      console.error("Failed to load tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.value.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || token.type === selectedType;
    return matchesSearch && matchesType;
  });

  const tokenTypes = ["all", ...new Set(tokens.map((t) => t.type))];

  const getTokenIcon = (type: string) => {
    switch (type) {
      case "color":
        return <Palette className="w-4 h-4" />;
      case "spacing":
        return <Ruler className="w-4 h-4" />;
      case "borderRadius":
        return <Ruler className="w-4 h-4" />;
      case "typography":
        return <Type className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">Loading tokens...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Design Tokens</h1>
        <p className="text-muted-foreground">
          Browse all design tokens organized by type and category
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {tokenTypes.map((type) => (
            <option key={type} value={type}>
              {type === "all"
                ? "All Types"
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Token Grid */}
      <div className="grid gap-4">
        {filteredTokens.length > 0 ? (
          filteredTokens.map((token, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                      {getTokenIcon(token.type)}
                    </div>
                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {token.category}
                        {token.mode && (
                          <span className="ml-1 px-2 py-0.5 bg-muted rounded text-xs">
                            {token.mode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {token.type === "color" && (
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: token.value }}
                      />
                    )}
                    <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                      {token.value}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No tokens found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
