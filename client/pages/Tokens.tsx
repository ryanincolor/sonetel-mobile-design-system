import { useState, useMemo } from "react";
import { Search, Filter, Eye, Code, Smartphone, Monitor } from "lucide-react";
import { TokenStore, mockTokens } from "@/lib/tokens";
import { TokenGrid } from "@/components/design-system/TokenDisplay";
import { DesignToken } from "@shared/design-tokens";

export default function Tokens() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [platform, setPlatform] = useState<"web" | "ios" | "android">("web");
  const [showCode, setShowCode] = useState(false);

  const tokens = useMemo(() => {
    let filtered = mockTokens;

    // Filter by search query
    if (searchQuery) {
      filtered = TokenStore.searchTokens(searchQuery);
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((token) => token.type === selectedType);
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (token) => token.category === selectedCategory,
      );
    }

    return filtered;
  }, [searchQuery, selectedType, selectedCategory]);

  const tokenTypes = useMemo(() => {
    const types = [...new Set(mockTokens.map((token) => token.type))];
    return types.sort();
  }, []);

  const tokenCategories = useMemo(() => {
    const categories = [...new Set(mockTokens.map((token) => token.category))];
    return categories.sort();
  }, []);

  const platformIcons = {
    web: Monitor,
    ios: Smartphone,
    android: Smartphone,
  };

  const PlatformIcon = platformIcons[platform];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Design Tokens
              </h1>
              <p className="text-muted-foreground mt-1">
                Browse and explore all design tokens
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Types</option>
            {tokenTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Categories</option>
            {tokenCategories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {/* Platform Toggle */}
          <div className="flex items-center bg-card border border-border rounded-xl p-1">
            {(["web", "ios", "android"] as const).map((p) => {
              const Icon = platformIcons[p];
              return (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    platform === p
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              );
            })}
          </div>

          {/* Show Code Toggle */}
          <button
            onClick={() => setShowCode(!showCode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
              showCode
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {showCode ? (
              <Eye className="w-4 h-4" />
            ) : (
              <Code className="w-4 h-4" />
            )}
            {showCode ? "Preview" : "Code"}
          </button>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {tokens.length} tokens
            {searchQuery && ` for "${searchQuery}"`}
            {selectedType !== "all" && ` in ${selectedType}`}
            {selectedCategory !== "all" && ` from ${selectedCategory}`}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <PlatformIcon className="w-4 h-4" />
            Optimized for {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </div>
        </div>

        {/* Token Grid */}
        <TokenGrid tokens={tokens} platform={platform} showCode={showCode} />

        {tokens.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No tokens found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
