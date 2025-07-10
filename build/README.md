# Sonetel Design System Components

## Installation

### Android (Jetpack Compose)
```kotlin
// Add to your project and import:
import com.sonetel.designsystem.components.SonetelButton
import com.sonetel.designsystem.SonetelDesignTokens

// Usage:
SonetelButton(
    text = "Click me",
    onClick = { /* handle click */ },
    size = SonetelButtonSize.Large,
    variant = SonetelButtonVariant.Primary
)
```

### iOS (SwiftUI)
```swift
// Import and use:
import SonetelDesignSystem

// Usage:
SonetelButton(
    title: "Click me",
    action: { /* handle tap */ },
    size: .large,
    variant: .primary
)
```

## Components

### Button v1.2.0
- **Android**: components/SonetelButton.kt
- **iOS**: components/SonetelButton.swift
- **Last Updated**: 7/10/2025

#### Latest Changes:
Updated Large button: height 48px, min-width 80px, padding 20x16px to match Figma

## Updating Components

1. **Submodule Approach**: Add this repo as a submodule and pull changes
2. **CI/CD Integration**: Set up automated checks for component updates
3. **Version Tracking**: Check `components.json` for version changes

Generated on: 7/10/2025
