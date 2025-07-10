# Android Integration Guide - Sonetel Mobile Design System

This guide shows how to integrate the shared Sonetel mobile design tokens into your Android app using **Material 3** and **Jetpack Compose**.

## 📱 Android Project Setup

### 1. Add Design System Files to Your Android Project

The sync process automatically places files in the correct locations:

```
app/src/main/
├── res/
│   ├── values/
│   │   └── design_colors.xml              # Light theme + dimensions
│   └── values-night/
│       └── design_colors.xml              # Dark theme colors
└── java/com/sonetel/designsystem/
    └── DesignSystemTokens.kt               # Compose object
```

### 2. Using Design Tokens in Your Android Code

#### XML Usage (Traditional Views)

```xml
<!-- In your layouts -->
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Hello World"
    android:textColor="@color/on_surface_on_surface_tertiary"
    android:background="@color/accents_blue"
    android:padding="@dimen/spacing_spacing_s" />

<!-- In styles.xml -->
<style name="AppTheme" parent="Theme.Material3.DayNight">
    <item name="colorPrimary">@color/accents_blue</item>
    <item name="colorSurface">@color/on_surface_on_surface_tertiary</item>
</style>
```

#### Jetpack Compose Usage (Material 3)

```kotlin
import com.sonetel.designsystem.DesignSystemTokens

@Composable
fun SonetelTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) {
        darkColorScheme(
            primary = DesignSystemTokens.accentsBlueDark,
            surface = DesignSystemTokens.solidZ0Dark,
            onSurface = DesignSystemTokens.onSurfaceOnSurfacePrimaryDark
        )
    } else {
        lightColorScheme(
            primary = DesignSystemTokens.accentsBlueLight,
            surface = DesignSystemTokens.solidZ0Light,
            onSurface = DesignSystemTokens.onSurfaceOnSurfacePrimaryLight
        )
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography(/* use DesignSystemTokens typography */),
        shapes = Shapes(/* use DesignSystemTokens radius */),
        content = content
    )
}

@Composable
fun MyScreen() {
    SonetelTheme {
        Surface(
            color = MaterialTheme.colorScheme.surface,
            modifier = Modifier.padding(DesignSystemTokens.spacingS)
        ) {
            Text(
                text = "Hello Sonetel",
                color = MaterialTheme.colorScheme.onSurface,
                style = MaterialTheme.typography.bodyLarge
            )
        }
    }
}
```

#### Programmatic Usage (Views)

```kotlin
// In your Activities/Fragments
import androidx.core.content.ContextCompat

val primaryColor = ContextCompat.getColor(this, R.color.accents_blue)
val spacing = resources.getDimensionPixelSize(R.dimen.spacing_spacing_s)

textView.setTextColor(ContextCompat.getColor(this, R.color.on_surface_on_surface_tertiary))
button.setBackgroundColor(primaryColor)
```

### 3. Dark Mode Support

#### Automatic Theme Switching

The generated `values/` and `values-night/` folders provide automatic light/dark mode support:

```kotlin
// Your app automatically switches between light and dark colors
// based on system theme settings

// In Compose, create theme-aware colors:
@Composable
fun MyAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colors = if (darkTheme) {
        darkColorScheme(
            primary = DesignSystemTokens.accentsBlueDark,
            surface = DesignSystemTokens.onSurfaceOnSurfaceTertiaryDark
        )
    } else {
        lightColorScheme(
            primary = DesignSystemTokens.accentsBlueLight,
            surface = DesignSystemTokens.onSurfaceOnSurfaceTertiaryLight
        )
    }

    MaterialTheme(
        colorScheme = colors,
        content = content
    )
}
```

## 🔄 Automatic Sync Setup

### Option 1: Manual Sync (Quick Start)

1. **Generate Android tokens:**

   ```bash
   npm run tokens:build:android
   ```

2. **Copy to Android project:**
   ```bash
   npm run sync:android
   ```

### Option 2: Automated Sync with Git (Recommended)

```bash
# Sync with git branch creation and commit
npm run sync:android:git

# Sync, commit, and push to remote
npm run sync:android:git:push
```

### Option 3: Configure Custom Paths

Set environment variables for custom project paths:

```bash
# Set custom Android project path
export ANDROID_PROJECT_PATH="/path/to/your/android/project"
npm run sync:android:git
```

## 🛠 Development Workflow

### 1. Design Changes in Figma

- Designer updates design tokens in Figma
- Token Studio exports to this design system repo

### 2. Token Generation

```bash
# Build Android tokens
npm run tokens:build:android

# Review changes
git diff dist/android/
```

### 3. Android Integration

```bash
# Sync to Android project with git operations
npm run sync:android:git

# Or manually copy files
cp -r dist/android/values/* /path/to/android/app/src/main/res/values/
cp -r dist/android/values-night/* /path/to/android/app/src/main/res/values-night/
cp dist/android/DesignSystemTokens.kt /path/to/android/app/src/main/java/com/sonetel/designsystem/
```

### 4. Test in Android App

- Build and test your Android app
- Verify light/dark mode switching
- Check that colors, dimensions look correct

## 📋 Migration Checklist

### Phase 1: Setup

- [ ] Verify design system files are in your Android project
- [ ] Add `DesignSystemTokens.kt` to your Compose theme
- [ ] Verify files compile without errors

### Phase 2: Replace Colors

- [ ] Replace hardcoded color values with `@color/` references
- [ ] Update theme colors in `styles.xml`
- [ ] Test light/dark mode switching
- [ ] Update Compose theme with design system colors

### Phase 3: Replace Dimensions

- [ ] Replace hardcoded spacing values with `@dimen/` references
- [ ] Update padding, margins, and sizes
- [ ] Test layout on different screen sizes

### Phase 4: Compose Integration

- [ ] Import `DesignSystemTokens` in Compose files
- [ ] Replace hardcoded values with token references
- [ ] Create theme-aware composables

### Phase 5: Automation

- [ ] Set up chosen sync method (manual, or automated)
- [ ] Test the sync workflow
- [ ] Document the process for your team

## 🔍 Troubleshooting

### Common Issues

1. **Build errors after adding files:**

   - Verify files are in correct directories
   - Check for naming conflicts
   - Ensure proper package names in Kotlin files

2. **Colors not switching in dark mode:**

   - Verify you have both `values/` and `values-night/` folders
   - Check that your app uses Material3 theme
   - Test with system dark mode toggle

3. **Compose theme not updating:**
   - Ensure `DesignSystemTokens` import is correct
   - Check package name matches your project structure
   - Verify theme composition structure

### Testing Dark Mode

```kotlin
// Test theme switching in your app
@Composable
fun ThemePreview() {
    Column {
        MyAppTheme(darkTheme = false) {
            MyComponent() // Test light theme
        }

        MyAppTheme(darkTheme = true) {
            MyComponent() // Test dark theme
        }
    }
}
```

### Build Verification

```bash
# In your Android project root
./gradlew assembleDebug

# Check for any compilation errors
./gradlew build
```

## 📚 Token Reference

### Available Colors

```xml
<!-- Light/Dark adaptive colors -->
<color name="on_surface_on_surface_tertiary">...</color>
<color name="accents_purple">...</color>
<color name="accents_yellow">...</color>
<color name="accents_orange">...</color>
<color name="accents_blue">...</color>
<color name="accents_green">...</color>
<color name="accents_pink">...</color>
```

### Available Dimensions

```xml
<!-- Spacing tokens -->
<dimen name="spacing_spacing_2xs">2dp</dimen>
<dimen name="spacing_spacing_s">8dp</dimen>
<dimen name="spacing_spacing_m">12dp</dimen>
<dimen name="spacing_spacing_l">16dp</dimen>
<dimen name="spacing_spacing_2xl">24dp</dimen>

<!-- Border radius tokens -->
<dimen name="radius_radius_s">4dp</dimen>
<dimen name="radius_radius_m">8dp</dimen>
<dimen name="radius_radius_l">12dp</dimen>
```

### Compose Tokens

```kotlin
// In DesignSystemTokens object
DesignSystemTokens.accentsBlueLight     // Color
DesignSystemTokens.accentsBlueDark      // Color
DesignSystemTokens.spacingSpacingS      // Dp
DesignSystemTokens.radiusRadiusM        // Dp
```

## 📱 Best Practices

1. **Use semantic naming:** Prefer `@color/accents_blue` over `@color/blue`
2. **Theme-aware development:** Always test both light and dark modes
3. **Consistent spacing:** Use dimension tokens for all spacing values
4. **Compose integration:** Use the Kotlin object for Compose components
5. **Version control:** Always commit design system changes together

## 🚀 Next Steps

1. **Set up the basic integration** following steps 1-2
2. **Choose your preferred sync method** (manual or automated)
3. **Start migrating existing code** using the phase checklist
4. **Set up automation** for continuous syncing

Need help with any specific step? The generated tokens are ready to use and will automatically handle light/dark mode switching!
