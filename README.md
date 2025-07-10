# Sonetel Mobile Design System

This is the **shared mobile design system** for the Sonetel native iOS and Android apps.
All design tokens are exported from **Figma using Token Studio** and stored in this repo.

The exported tokens are structured in **Token Studio JSON format**, and transformed per platform using **Style Dictionary**.

## 📁 Token Types

This system includes tokens for:

- **Colors** (light + dark themes)
- **Typography**
- **Spacing**
- **Radius**
- **Elevation / shadows**

## 🔄 Token Workflow

1. Tokens are exported from **Figma** using Token Studio
2. JSON files are stored under `/tokens` with organized structure:
   - **Core tokens**: Primitive values in `/tokens/Core/`
   - **System tokens**: Semantic values in `/tokens/Sys/`
3. **Advanced token processing** with automatic reference resolution:
   - Smart reference mapping across token hierarchies
   - Automatic light/dark mode color pairing
   - Cross-platform naming convention handling
   - **iOS**: Adaptive colors with UITraitCollection support
   - **Android**: XML resources + Jetpack Compose Material 3 integration

## 📱 Platform Integration

### ✅ Android (Jetpack Compose)

- Use **Material 3** as base
- Apply tokens in `Theme.kt` using `MaterialTheme(...)`
- Consume output in Android repo via Git submodule or CI pull
- Example usage: `AppTheme { ... }`

### ✅ iOS (SwiftUI)

- Use `Theme.swift` or equivalent to expose color, font, spacing constants
- Consume output via SwiftGen, SPM, or embedded Swift files
- Support Dark Mode, Dynamic Type, and accessibility scaling

### 🧠 Builder.io Integration

- This repo is the **single source of truth** for all mobile design tokens
- Builder.io's native mobile SDK should import and apply the token values to generated components
- All components should respect platform standards while inheriting shared visual styles
- **No hardcoded values** — only token references

## Quick Start

```bash
# Install dependencies
npm install

# 🚀 One command to update both mobile apps
npm run sync:all:git
```

**That's it!** This single command generates fresh tokens and syncs them to both iOS and Android projects with git branches.

## Development Commands

```bash
npm run dev        # Start dev server (client + server)
npm run build      # Production build
npm run start      # Start production server
npm run typecheck  # TypeScript validation
npm test          # Run Vitest tests
```

## Design Token Building

### Generate Design Tokens

Build design tokens from the token files:

```bash
npm run tokens:build          # Generate tokens for all platforms (iOS + Android)
npm run tokens:build:ios      # Generate iOS Swift files only
npm run tokens:build:android  # Generate Android XML and Kotlin files
npm run tokens:build:all      # Generate tokens for both platforms
```

This generates **production-ready platform-specific files** with advanced features:

**iOS Output (`dist/ios/`):**

- `DesignSystemColors.swift` - **UITraitCollection-based adaptive colors** (automatic light/dark switching)
- `DesignSystemTypography.swift` - Dynamic Type compatible font sizes and weights
- `DesignSystemSpacing.swift` - Spacing, border radius + UIEdgeInsets helpers

**Android Output (`dist/android/`):**

- `values/design_colors.xml` - Light theme color resources
- `values-night/design_colors.xml` - Dark theme color resources
- `values/design_dimens.xml` - Spacing and radius dimensions
- `DesignSystemTokens.kt` - **Jetpack Compose object** with Color/dp/sp values
- `SonetelColorScheme.kt` - **Material 3 ColorScheme** integration
- `stats.json` - Token generation metadata and counts

**Key Improvements:**

- **Smart reference resolution** - Automatically resolves `{Core.spacing.lg}` style references
- **Adaptive iOS colors** - Single UIColor that automatically switches between light/dark
- **Material 3 integration** - Pre-configured ColorScheme for Android apps
- **Cross-platform consistency** - Same token extraction logic ensures identical output
- **Production-ready** - Includes usage examples and best practices in generated code

### Sync Tokens to Mobile Apps

#### iOS Sync Commands

```bash
npm run sync:ios            # Copy tokens to iOS project
npm run sync:ios:git        # Copy + create git branch and commit
npm run sync:ios:push       # Copy + git operations + push to remote
```

#### Android Sync Commands

```bash
npm run sync:android        # Copy tokens to Android project
npm run sync:android:git    # Copy + create git branch and commit
npm run sync:android:push   # Copy + git operations + push to remote
```

#### Cross-Platform Sync Commands

```bash
npm run sync:all            # Sync to both iOS and Android
npm run sync:all:git        # Sync to both platforms with git operations
npm run sync:all:push       # Sync to both platforms + git operations + push to remote
```

The sync commands:

1. **Generate fresh design tokens** using improved extraction engine
2. **Copy platform-optimized files** to your mobile projects:
   - **iOS**: Adaptive Swift files to `../sonetel-mobile-ios/Sonetel Mobile/DesignSystem/`
   - **Android**: XML resources to `app/src/main/res/` and Material 3 Kotlin to `app/src/main/java/com/sonetel/designsystem/`
3. **Smart git integration** - create feature branches and meaningful commits
4. **Detailed integration reports** with token counts and usage examples

**Advanced Git Integration:**

- **Automatic branching** - Creates dated branches like `design-system-update-2024-01-15`
- **Smart commits** - Meaningful commit messages with file summaries
- **Push automation** - Optional remote push with `--push` commands
- **Project detection** - Only performs git operations if target is a git repository
- **Slack notifications** - Optional team notifications via webhook (set `SLACK_WEBHOOK_URL`)

#### Manual Token Status Check

```bash
npm run sync:status         # Check automation sync status
npm run sync:manual         # Trigger manual sync via API
```

## Project Structure

```
tokens/                   # Design token definitions (Token Studio JSON format)
├── Core/                 # Core primitive tokens
│   ├── Archive/Color/    # Color primitives
│   ├── Typography/       # Font primitives
│   └── Spacings/         # Spacing primitives
└── Sys/                  # System/semantic tokens
    ├── Color/            # Light & Dark color schemes
    ├── Typography.json   # Typography scale
    ├── Spacing.json      # Spacing scale
    └── Border Radius.json # Radius scale

scripts/                  # Build and sync automation
├── quick-ios-build.js    # iOS Swift generation
├── quick-android-build-v2.js # Android Kotlin/XML generation
├── sync-ios.js           # iOS project sync with git
└── sync-android.js       # Android project sync with git

dist/                     # Generated platform files
├── ios/                  # Production-ready Swift files
│   ├── DesignSystemColors.swift      # UITraitCollection adaptive colors
│   ├── DesignSystemTypography.swift  # Dynamic Type compatible fonts
│   ├── DesignSystemSpacing.swift     # Spacing + UIEdgeInsets helpers
│   └── stats.json                    # Generation metadata
└── android/              # Material 3 ready Android files
    ├── values/design_colors.xml      # Light theme resources
    ├── values/design_dimens.xml      # Spacing/radius dimensions
    ├── values-night/design_colors.xml # Dark theme resources
    ├── DesignSystemTokens.kt         # Compose object with all tokens
    ├── SonetelColorScheme.kt         # Material 3 ColorScheme
    └── stats.json                    # Generation metadata

client/                   # Minimal web interface
├── pages/                # Design system overview pages
└── components/ui/        # Essential UI components

server/                   # Design system API
├── routes/               # Token sync and automation APIs
└── index.ts              # Express server for design system ops
```

## Key Features

### SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page.
- Routes are defined in `client/App.tsx` using the `react-router-dom` import
- Route files are located in the `client/pages/` directory

### Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/global.css`
- **UI components**: Pre-built library in `client/components/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge` for conditional classes

### Express Server Integration

- **Development**: Single port (8080) for both frontend/backend
- **Hot reload**: Both client and server code
- **API endpoints**: Prefixed with `/api/`

## Adding Features

### New API Route

1. Create a new route handler in `server/routes/my-route.ts`
2. Register the route in `server/index.ts`
3. Use in React components with type safety

### New Page Route

1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`

## Production Deployment

- **Standard**: `npm run build` + `npm start`
- **Docker**: Dockerfile included
- **Binary**: Self-contained executables (Linux, macOS, Windows)
- Express serves the built React SPA with fallback routing support

## Architecture Notes

- Single-port development with Vite + Express integration
- TypeScript throughout (client, server, shared)
- Full hot reload for rapid development
- Production-ready with multiple deployment options
- Comprehensive UI component library included
- Type-safe API communication via shared interfaces

For detailed documentation, see [AGENTS.md](./AGENTS.md).
