# Android Integration Guide - Sonetel Design System

## 🚨 Common Import Issues & Solutions

### Issue 1: Build Failures

If the Android app breaks when importing the design system, check these common issues:

#### **Dependencies Required**

Add these to your `build.gradle` (Module: app):

```kotlin
dependencies {
    // Compose BOM - manages all compose library versions
    implementation platform('androidx.compose:compose-bom:2024.02.00')

    // Core Compose dependencies
    implementation 'androidx.compose.ui:ui'
    implementation 'androidx.compose.material3:material3'
    implementation 'androidx.compose.ui:ui-tooling-preview'

    // Activity Compose
    implementation 'androidx.activity:activity-compose:1.8.2'

    // Optional: for @Preview annotations
    debugImplementation 'androidx.compose.ui:ui-tooling'
}
```

#### **Compiler Options**

Add this to your `build.gradle` (Module: app):

```kotlin
android {
    compileSdk 34

    defaultConfig {
        minSdk 21
        targetSdk 34
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }

    buildFeatures {
        compose true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = '1.5.8'
    }
}
```

### Issue 2: Package Structure

Ensure your package structure matches:

```
app/src/main/java/
└── com/
    └── sonetel/
        ├── designsystem/
        │   ├── SonetelDesignTokens.kt
        │   ├── SonetelColorScheme.kt
        │   ├── SonetelTypography.kt
        │   ├── SonetelShapes.kt
        │   └── components/
        │       └── SonetelButton.kt
        └── ui/
            └── theme/
                └── SonetelTheme.kt
```

### Issue 3: Import Issues

If you get "Unresolved reference" errors:

1. **Clean and rebuild** your project
2. **Invalidate caches**: File → Invalidate Caches and Restart
3. **Check imports** in your Activity/Fragment:

```kotlin
import com.sonetel.designsystem.components.SonetelButton
import com.sonetel.designsystem.SonetelDesignTokens
import com.sonetel.ui.theme.SonetelTheme
```

## ✅ Working Implementation

### Basic Usage in Activity

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SonetelTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    WelcomeScreen()
                }
            }
        }
    }
}

@Composable
fun WelcomeScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Welcome to Sonetel", style = MaterialTheme.typography.headlineMedium)

        Spacer(modifier = Modifier.height(32.dp))

        // X-Large Primary Button (as per your request)
        SonetelButton(
            text = "Get Started",
            onClick = {
                // Navigate to next screen
                // navController.navigate("next_screen")
            },
            modifier = Modifier.fillMaxWidth(),
            size = SonetelButtonSize.ExtraLarge,
            variant = SonetelButtonVariant.Primary
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Secondary button
        SonetelButton(
            text = "Learn More",
            onClick = { /* Handle click */ },
            size = SonetelButtonSize.Large,
            variant = SonetelButtonVariant.Secondary
        )
    }
}
```

### Complete Example with All Button Variants

```kotlin
@Composable
fun ButtonShowcase() {
    LazyColumn(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text("Button Sizes", style = MaterialTheme.typography.headlineSmall)
        }

        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                SonetelButtonSize.entries.forEach { size ->
                    SonetelButton(
                        text = "\${size.name} Button",
                        onClick = { },
                        size = size,
                        modifier = if (size == SonetelButtonSize.ExtraLarge)
                            Modifier.fillMaxWidth() else Modifier
                    )
                }
            }
        }

        item {
            Text("Button Variants", style = MaterialTheme.typography.headlineSmall)
        }

        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                SonetelButtonVariant.entries.forEach { variant ->
                    SonetelButton(
                        text = "\${variant.name} Button",
                        onClick = { },
                        variant = variant,
                        size = SonetelButtonSize.Large
                    )
                }
            }
        }
    }
}
```

## 🔧 Troubleshooting

### Build Error: "Unresolved reference: SonetelButton"

1. Ensure you've copied all files from `build/android/` to your project
2. Verify package names match your project structure
3. Clean and rebuild project

### Build Error: "Compose Compiler incompatible"

Update your Compose versions in `build.gradle`:

```kotlin
compose_version = '2024.02.00'
kotlin_version = '1.9.0'
```

### Build Error: "Design tokens not found"

Ensure `SonetelDesignTokens.kt` is in the correct package and properly imported.

### Runtime Error: "Theme not applied"

Wrap your content with `SonetelTheme`:

```kotlin
SonetelTheme {
    // Your content here
}
```

## 📞 Support

If you continue having issues:

1. Check the `components.json` for the latest version
2. Verify all required dependencies are included
3. Ensure your Kotlin and Compose versions are compatible

**Generated:** ${new Date().toLocaleDateString()}  
**Component Version:** 1.2.0
