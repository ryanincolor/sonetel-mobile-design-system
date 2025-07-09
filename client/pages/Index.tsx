import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Palette, Type, Ruler, Download, Eye, ArrowRight } from "lucide-react";

interface TokenStats {
  total: number;
  colors: number;
  typography: number;
  spacing: number;
  categories: string[];
}

export default function Index() {
  const [stats, setStats] = useState<TokenStats>({
    total: 0,
    colors: 0,
    typography: 0,
    spacing: 0,
    categories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    let totalTokens = 0;
    let colorTokens = 0;
    let typographyTokens = 0;
    let spacingTokens = 0;
    const categories = new Set<string>();

    try {
      // Count tokens from each file
      const files = [
        { path: "/tokens/Sys/Color/Light.json", category: "Color" },
        { path: "/tokens/Sys/Typography.json", category: "Typography" },
        { path: "/tokens/Sys/Spacing.json", category: "Spacing" },
        { path: "/tokens/Sys/Border Radius.json", category: "Border Radius" },
        { path: "/tokens/Core/Colors/Mode 1.json", category: "Core Colors" },
      ];

      for (const file of files) {
        try {
          const response = await fetch(file.path);
          if (response.ok) {
            const data = await response.json();
            const count = countTokens(data);
            totalTokens += count;
            categories.add(file.category);

            // Categorize tokens
            if (file.category.includes("Color")) {
              colorTokens += count;
            } else if (file.category.includes("Typography")) {
              typographyTokens += count;
            } else if (file.category.includes("Spacing")) {
              spacingTokens += count;
            }
          }
        } catch (error) {
          console.warn(`Failed to load ${file.path}:`, error);
        }
      }

      setStats({
        total: totalTokens,
        colors: colorTokens,
        typography: typographyTokens,
        spacing: spacingTokens,
        categories: Array.from(categories),
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const countTokens = (obj: any, count = 0): number => {
    for (const value of Object.values(obj)) {
      if (value && typeof value === "object") {
        if ("value" in value && "type" in value) {
          count++;
        } else {
          count = countTokens(value, count);
        }
      }
    }
    return count;
  };

  const statCards = [
    {
      label: "Total Tokens",
      value: stats.total,
      icon: Eye,
      color: "bg-blue-100 text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Colors",
      value: stats.colors,
      icon: Palette,
      color: "bg-green-100 text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Typography",
      value: stats.typography,
      icon: Type,
      color: "bg-purple-100 text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Spacing",
      value: stats.spacing,
      icon: Ruler,
      color: "bg-orange-100 text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading design system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Mobile Design System
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Shared design tokens for iOS and Android apps
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/tokens"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Eye className="w-5 h-5" />
                Browse {stats.total} Tokens
              </Link>
              <Link
                to="/export"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors"
              >
                <Download className="w-5 h-5" />
                Export for Mobile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl p-6 text-center`}
            >
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg mx-auto mb-4 flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Available Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Token Categories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Design tokens for {category.toLowerCase()} in your mobile apps
                </p>
                <Link
                  to="/tokens"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View Tokens
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Support */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready for Mobile Development
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Export your design tokens as platform-specific code for iOS and
              Android development.
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold">🍎</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">iOS</h3>
                <p className="text-gray-600 text-sm">
                  Swift constants for UIKit and SwiftUI
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold">🤖</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Android</h3>
                <p className="text-gray-600 text-sm">
                  XML resources and Kotlin for Jetpack Compose
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
