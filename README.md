# Fusion Starter

A production-ready full-stack React application template with integrated Express server, featuring React Router 6 SPA mode, TypeScript, Vitest, Zod and modern tooling.

While the starter comes with a express server, only create endpoint when strictly necessary, for example to encapsulate logic that must leave in the server, such as private keys handling, or certain DB operations, db...

## Tech Stack

- **Frontend**: React 18 + React Router 6 (spa) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express server integrated with Vite dev server
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

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
npm run tokens:build        # Generate iOS Swift files from design tokens
```

This generates adaptive Swift files with automatic light/dark mode support:

- `dist/ios/DesignSystemColors.swift` - Adaptive colors
- `dist/ios/DesignSystemTypography.swift` - Typography tokens
- `dist/ios/DesignSystemSpacing.swift` - Spacing and border radius

### Sync Tokens to Mobile Apps

#### iOS Sync Commands

```bash
npm run sync:ios            # Copy tokens to iOS project
npm run sync:ios:git        # Copy + create git branch and commit
npm run sync:ios:git:push   # Copy + git operations + push to remote
```

The sync commands:

1. Generate fresh design tokens
2. Copy Swift files to your iOS project at `../sonetel-mobile-ios/Sonetel Mobile/DesignSystem/`
3. Optionally create git branches and commit changes
4. Provide integration reports

#### Manual Token Status Check

```bash
npm run sync:status         # Check automation sync status
npm run sync:manual         # Trigger manual sync via API
```

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── App.tsx                # App entry point and with SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

server/                   # Express API backend
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types used by both client & server
└── api.ts                # Example of how to share api interfaces

tokens/                   # Design token definitions
├── Core/                 # Core token values
└── Sys/                  # System tokens (semantic)
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
