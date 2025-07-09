# iOS Integration Guide - Design System with Builder.io

This guide shows how to integrate the design system tokens into your Builder.io iOS app and set up automatic syncing.

## 📱 iOS Project Setup

### 1. Add Design System Files to Your iOS Project

1. **Create DesignSystem folder in Xcode:**

   ```
   YourApp/
   ├── DesignSystem/
   │   ├── DesignSystemColors.swift
   │   ├── DesignSystemTypography.swift
   │   └── DesignSystemSpacing.swift
   ```

2. **Copy the generated Swift files:**

   - From: `dist/ios/*.swift`
   - To: Your iOS project's `DesignSystem` folder

3. **Add files to Xcode target:**
   - Right-click DesignSystem folder in Xcode
   - Choose "Add Files to [YourApp]"
   - Select all 3 Swift files
   - Make sure they're added to your app target

### 2. Using Design Tokens in Your iOS Code

#### Colors (Automatic Light/Dark Mode)

```swift
// UIKit
view.backgroundColor = .solidZ0           // Automatically adapts to light/dark
label.textColor = .onSurfacePrimary      // Smart text color
button.backgroundColor = .accentsBlue    // Accent colors

// SwiftUI
struct ContentView: View {
    var body: some View {
        VStack {
            Text("Hello World")
                .foregroundColor(Color(UIColor.onSurfacePrimary))
                .background(Color(UIColor.solidZ0))
        }
    }
}
```

#### Typography

```swift
// UIKit
titleLabel.font = UIFont.systemFont(
    ofSize: DesignSystemTypography.headlineH1,
    weight: DesignSystemTypography.fontWeightBold
)

// SwiftUI
Text("Title")
    .font(.system(size: DesignSystemTypography.headlineH1, weight: .bold))
```

#### Spacing & Layout

```swift
// UIKit
stackView.spacing = DesignSystemSpacing.spacingMd
view.layer.cornerRadius = DesignSystemSpacing.radiusLg

// Auto Layout constraints
leadingConstraint.constant = DesignSystemSpacing.spacingSm
topConstraint.constant = DesignSystemSpacing.spacingXl

// SwiftUI
VStack(spacing: DesignSystemSpacing.spacingMd) {
    // content
}
.padding(.horizontal, DesignSystemSpacing.spacingLg)
```

### 3. Builder.io Integration

#### Replace Hardcoded Values

Before:

```swift
// ❌ Hardcoded values
view.backgroundColor = UIColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0)
label.textColor = UIColor.black
stackView.spacing = 16
```

After:

```swift
// ✅ Design system tokens
view.backgroundColor = .solidZ0        // Automatically light/dark
label.textColor = .onSurfacePrimary   // Semantic color
stackView.spacing = DesignSystemSpacing.spacingMd  // Consistent spacing
```

#### Builder.io Components

```swift
// Custom Builder.io component using design tokens
class DesignSystemButton: UIButton {
    override func awakeFromNib() {
        super.awakeFromNib()

        // Apply design system styling
        backgroundColor = .accentsBlue
        setTitleColor(.onSurfacePrimary, for: .normal)
        layer.cornerRadius = DesignSystemSpacing.radiusMd

        // Typography
        titleLabel?.font = UIFont.systemFont(
            ofSize: DesignSystemTypography.bodyMd,
            weight: DesignSystemTypography.fontWeightMedium
        )

        // Spacing
        contentEdgeInsets = UIEdgeInsets.all(DesignSystemSpacing.spacingSm)
    }
}
```

## 🔄 Automatic Sync Setup

### Option 1: Manual Copy (Quick Start)

1. **Generate tokens:**

   ```bash
   npm run tokens:build
   ```

2. **Copy to iOS project:**
   ```bash
   cp dist/ios/*.swift /path/to/your/ios/project/DesignSystem/
   ```

### Option 2: Automated Sync (Recommended)

#### A. Git Submodule Setup

```bash
# In your iOS project root
git submodule add https://github.com/yourusername/design-system.git DesignSystemTokens

# Create symlinks to the generated files
ln -s DesignSystemTokens/dist/ios/DesignSystemColors.swift YourApp/DesignSystem/
ln -s DesignSystemTokens/dist/ios/DesignSystemTypography.swift YourApp/DesignSystem/
ln -s DesignSystemTokens/dist/ios/DesignSystemSpacing.swift YourApp/DesignSystem/
```

#### B. GitHub Actions Workflow

```yaml
# .github/workflows/sync-ios.yml
name: Sync iOS Tokens
on:
  push:
    branches: [main]
    paths: ["tokens/**"]

jobs:
  sync-ios:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Generate iOS tokens
        run: npm run tokens:build

      - name: Deploy to iOS repo
        uses: peaceiris/actions-gh-pages@v3
        with:
          personal_token: ${{ secrets.IOS_DEPLOY_TOKEN }}
          external_repository: yourusername/your-ios-app
          publish_branch: design-system-update
          publish_dir: dist/ios
          destination_dir: YourApp/DesignSystem
```

#### C. Webhook Integration (Advanced)

Create a webhook that notifies your iOS CI/CD when tokens are updated.

### Option 3: Package Manager Integration

#### Swift Package Manager

Create a Swift package for your design tokens:

```swift
// Package.swift
// swift-tools-version:5.5
import PackageDescription

let package = Package(
    name: "DesignSystemTokens",
    platforms: [.iOS(.v13)],
    products: [
        .library(name: "DesignSystemTokens", targets: ["DesignSystemTokens"]),
    ],
    targets: [
        .target(name: "DesignSystemTokens", path: "Sources")
    ]
)
```

## 🛠 Development Workflow

### 1. Design Changes in Figma

- Designer updates design tokens in Figma
- Token Studio exports to this design system repo

### 2. Token Generation

```bash
# Build new tokens
npm run tokens:build

# Review changes
git diff dist/ios/
```

### 3. iOS Integration

```bash
# If using manual copy:
cp dist/ios/*.swift /path/to/ios/project/DesignSystem/

# If using git submodule:
cd /path/to/ios/project
git submodule update --remote DesignSystemTokens
```

### 4. Test in iOS App

- Build and test your iOS app
- Verify light/dark mode switching
- Check that colors, typography, and spacing look correct

## 📋 Migration Checklist

### Phase 1: Setup

- [ ] Create DesignSystem folder in iOS project
- [ ] Add generated Swift files
- [ ] Verify files compile without errors

### Phase 2: Replace Colors

- [ ] Replace hardcoded `UIColor` values with design tokens
- [ ] Test light/dark mode switching
- [ ] Update any color constants or extensions

### Phase 3: Replace Typography

- [ ] Replace hardcoded font sizes with `DesignSystemTypography`
- [ ] Update font weight constants
- [ ] Test text rendering across different screen sizes

### Phase 4: Replace Spacing

- [ ] Replace hardcoded spacing values with `DesignSystemSpacing`
- [ ] Update corner radius values
- [ ] Test layout on different devices

### Phase 5: Automation

- [ ] Set up chosen sync method (manual, submodule, or CI/CD)
- [ ] Test the sync workflow
- [ ] Document the process for your team

## 🔍 Troubleshooting

### Common Issues

1. **Colors not switching in dark mode:**

   - Ensure you're using the design system colors (e.g., `.solidZ0`)
   - Check that your view respects `traitCollection.userInterfaceStyle`

2. **Build errors after adding files:**

   - Verify files are added to the correct target
   - Check for naming conflicts with existing code

3. **Spacing looks wrong:**
   - Ensure you're using `CGFloat` values correctly
   - Check that Auto Layout constraints are updated

### Testing

```swift
// Test color adaptation
override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
    super.traitCollectionDidChange(previousTraitCollection)

    if traitCollection.hasDifferentColorAppearance(comparedTo: previousTraitCollection) {
        // Colors will automatically update, but you can add custom logic here
        print("Switched to \(traitCollection.userInterfaceStyle == .dark ? "dark" : "light") mode")
    }
}
```

## 📚 Next Steps

1. **Set up the basic integration** following steps 1-2
2. **Choose your preferred sync method** (manual, submodule, or CI/CD)
3. **Start migrating existing code** using the phase checklist
4. **Set up automation** for continuous syncing

Need help with any specific step? The generated tokens are ready to use and will automatically handle light/dark mode switching!
