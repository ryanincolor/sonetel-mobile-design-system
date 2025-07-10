# 📱 How to Update Mobile Apps with Design Tokens

## 🚀 Dead Simple Process

When design tokens are updated in Figma, follow these steps to update both iOS and Android apps:

### 1️⃣ One Command Updates Everything

```bash
npm run sync:all:git
```

That's it! This single command:

- ✅ Generates fresh tokens for both platforms
- ✅ Copies files to both iOS and Android projects
- ✅ Creates git branches with changes
- ✅ Commits the updates automatically

### 2️⃣ Push Changes (Optional)

```bash
npm run sync:all:git:push
```

This pushes the changes to remote repositories for review.

## 📋 Available Commands

| Command                     | What it does                        |
| --------------------------- | ----------------------------------- |
| `npm run sync:all`          | Basic sync to both platforms        |
| `npm run sync:all:git`      | Sync + create git branches + commit |
| `npm run sync:all:git:push` | Sync + git + push to remote         |

## 🎯 What Gets Updated

### iOS Project (`../sonetel-mobile-ios`)

```
Sonetel Mobile/DesignSystem/
├── DesignSystemColors.swift     # Adaptive light/dark colors
├── DesignSystemTypography.swift # Font sizes
└── DesignSystemSpacing.swift    # Spacing + border radius
```

### Android Project (`../sonetel-mobile-android`)

```
app/src/main/
├── res/
│   ├── values/design_colors.xml         # Light theme colors
│   ├── values/design_dimens.xml         # Spacing + dimensions
│   └── values-night/design_colors.xml   # Dark theme colors
└── java/com/sonetel/
    ├── designsystem/SonetelDesignTokens.kt  # Compose tokens
    └── ui/theme/SonetelColorScheme.kt       # Material 3 theme
```

## 💡 Best Practices

### ✅ DO

- Run `npm run sync:all:git` after token updates
- Test both light and dark modes after sync
- Build both apps to verify compilation
- Use the generated design tokens instead of hardcoded values

### ❌ DON'T

- Edit generated files manually (they'll be overwritten)
- Skip testing after sync
- Use hardcoded colors/spacing in app code

## 🔧 Usage in Apps

### iOS (Swift/SwiftUI)

```swift
// UIKit
view.backgroundColor = .solidZ0
label.textColor = .onSurfacePrimary

// SwiftUI
Color.solidZ0
Text("Hello").foregroundColor(.onSurfacePrimary)
```

### Android (XML/Compose)

```xml
<!-- XML -->
android:background="@color/solid_z0"
android:textColor="@color/on_surface_primary"
```

```kotlin
// Compose
Surface(color = SonetelDesignTokens.solidZ0Light) {
    Text(
        text = "Hello",
        color = SonetelDesignTokens.onSurfacePrimaryLight
    )
}

// Material 3 Theme
MaterialTheme(
    colorScheme = SonetelColorScheme.LightColorScheme
) { ... }
```

## 🔍 Troubleshooting

**Problem**: Command fails with "project not found"  
**Solution**: Set environment variables:

```bash
export IOS_PROJECT_PATH="/path/to/your/ios/project"
export ANDROID_PROJECT_PATH="/path/to/your/android/project"
npm run sync:all:git
```

**Problem**: Git operations fail  
**Solution**: Ensure both projects are git repositories with clean working directories

**Problem**: Build errors after sync  
**Solution**: Check that all generated files are added to your Xcode/Android Studio projects

## 📊 Sync Report

After each sync, you'll see a detailed report showing:

- Number of tokens synced (colors, typography, spacing)
- Files updated in each platform
- Usage examples for both platforms
- Next steps for testing

---

**🎯 Key Takeaway**: One command (`npm run sync:all:git`) keeps both mobile apps perfectly in sync with the latest design tokens!
