# Android App Integration Fix

## Problem

The Android app is experiencing compilation errors due to:

1. **Duplicate SonetelDesignTokens declarations**
2. **Unresolved design token references**

## Root Cause

The Android app has its own `SonetelDesignTokens.kt` file that conflicts with the generated design system tokens.

## Solution

### Step 1: Remove Duplicate File

**Delete** the existing `SonetelDesignTokens.kt` file from the Android app:

```
/app/src/main/java/com/sonetel/designsystem/SonetelDesignTokens.kt
```

### Step 2: Update Imports

Ensure all files in the Android app import from the **generated design system**:

**Before:**

```kotlin
import com.sonetel.designsystem.SonetelDesignTokens  // App's version
```

**After:**

```kotlin
import com.sonetel.designsystem.SonetelDesignTokens  // Generated version
```

### Step 3: Verify Generated Files Location

Ensure the design system is properly synced to:

```
/design-system/build/android/
```

The following files should be present:

- `SonetelDesignTokens.kt` ✅
- `SonetelTypography.kt` ✅
- `SonetelColorScheme.kt` ✅
- `SonetelTheme.kt` ✅
- `components/SonetelButton.kt` ✅

### Step 4: Update Build Configuration

If using submodules or direct file copying, ensure the Android app's build configuration points to the generated design system files in `/design-system/build/android/`.

## Verification

After making these changes, the following tokens should be accessible:

### Color Tokens

- `onSurfaceOnSurfacePrimaryLight` ✅
- `onSurfaceOnSurfacePrimaryDark` ✅
- `solidZ0Dark` ✅

### Typography Tokens

- `fontSize3xl`, `fontSize4xl`, `fontSize5xl` ✅
- `fontSizeBase`, `fontSizeXxs` ✅
- `lineHeight16`, `lineHeight20`, `lineHeight22`, etc. ✅
- `letterSpacingTight` ✅

### Usage Example

```kotlin
// This should work after the fix
Text(
    text = "Sample Text",
    style = SonetelTypography.Headline3xl.prominent,
    color = SonetelDesignTokens.onSurfaceOnSurfacePrimaryLight
)
```

## Support

If issues persist after following these steps, the generated design system files are correct and complete. The issue would be in the Android app's integration setup.
